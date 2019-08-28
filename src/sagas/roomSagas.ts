import { put, select, takeEvery, call, fork } from 'redux-saga/effects'
import { AnyAction } from 'redux'
import database, { rsf } from '../firebase/firebase'
import { showError, createRoom, syncMessages } from '../actions/rooms'
import { CollectionReference } from '@firebase/firestore-types'

export function* updateRoomPresences() {
	const auth = yield select(state => state.auth)
	const { uid, ...userData } = auth
	// get user rooms
	const userRoomsQuery = yield call(
		rsf.firestore.getCollection,
		`users/${auth.uid}/rooms`,
	)

	if (!userRoomsQuery.empty) {
		const userRoomIds: string[] = []
		userRoomsQuery.forEach((userRoomDoc: any) => {
			userRoomIds.push(userRoomDoc.id)
		})

		for (var roomId in userRoomIds) {
			yield call(
				// @ts-ignore
				rsf.firestore.setDocument,
				`rooms/${roomId}/people/${auth.uid}`,
				{
					id: auth.uid,
					...userData,
				},
			)
		}
	}
}

export function* joinRoom(action: AnyAction) {
	const { roomId } = action
	const { uid, displayName, photoURL } = yield select(state => state.auth)
	const roomRef = database.doc(`rooms/${roomId}`)

	const roomDoc = yield call(rsf.firestore.getDocument, roomRef)
	const room = { id: roomDoc.id, ...roomDoc.data() } as RoomItem

	if (!room || !roomDoc.exists) {
		yield put(showError('Room not found!'))
		return
	} else if (
		room.people &&
		room.people.find((person: Person) => person.id === uid)
	) {
		// if we are already in this room then
		// history.push(`room/${data.roomName}`);
		// return i guess ?
		return
	} else {
		// we should add ourselves to this room

		const person = {
			name: displayName,
			photoURL: photoURL,
			id: uid,
			unread: 0,
			lastRead: 0,
		}

		console.log({ person })

		// TODO figure wtf is wrong here
		yield call(
			// @ts-ignore
			rsf.firestore.setDocument,
			`rooms/${roomId}/people/${person.id}`,
			person,
		)

		yield call(
			// @ts-ignore
			rsf.firestore.setDocument,
			`users/${person.id}/rooms/${roomId}`,
			{ roomName: room.name },
		)

		// fetch full room and subscribe
		yield call(fetchRoom, roomId)
	}
}

export function* fetchRoom(roomId: string) {
	console.log('try fetch room ', roomId)
	// fetch joined room from firestore
	const roomRef = database.collection('rooms').doc(roomId)
	const roomDoc = yield call(rsf.firestore.getDocument, roomRef)

	// if we have such room
	if (roomDoc.exists) {
		const room = roomDoc.data()
		const people: any[] = []
		const messages: any = {}

		// get room's people
		const peopleQuery = yield call(
			rsf.firestore.getCollection,
			roomRef.collection('people'),
		)
		peopleQuery.forEach((peopleDoc: any) => {
			people.push({ id: peopleDoc.id, ...peopleDoc.data() })
		})
		console.log({ people })

		// get room's messages first page
		const messagePage = roomRef
			.collection('messages')
			.orderBy('createdAt', 'desc')
			.limit(25) as CollectionReference

		const messagesQuery = yield call(rsf.firestore.getCollection, messagePage)

		messagesQuery.forEach((messageDoc: any) => {
			messages[messageDoc.id] = { id: messageDoc.id, ...messageDoc.data() }
		})
		// messages.sort(byCreatedAt)

		yield put(
			createRoom({
				id: roomRef.id,
				name: room ? room.name : 'Error',
				people,
				messages,
			}),
		)

		// subscribe to latest message
		const newestMessage = roomRef
			.collection('messages')
			.orderBy('createdAt', 'desc')
			.limit(1) as CollectionReference

		// TODO merge this with other messages to save on reads
		yield fork(rsf.firestore.syncCollection, newestMessage, {
			successActionCreator: (snapshot: any) => syncMessages(snapshot, roomId),
		})
	}
}

function* joinRoomListener() {
	yield takeEvery('JOIN_ROOM_SAGA', joinRoom)
}

function* updateRoomPresencesListener() {
	yield takeEvery('UPDATE_ROOM_PRESENCES', updateRoomPresences)
}

export default [joinRoomListener(), updateRoomPresencesListener()]
