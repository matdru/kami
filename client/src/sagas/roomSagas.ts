import { put, select, takeEvery, call, fork } from 'redux-saga/effects'
import { AnyAction } from 'redux'
import database, { rsf } from '../firebase/firebase'
import * as types from '../constants/ActionTypes'
import {
	showError,
	updateRoom,
	syncMessages,
	updateMessages,
} from '../actions/rooms'
import { CollectionReference, QuerySnapshot } from '@firebase/firestore-types'
import { getEarliestMessageForRoomId } from '../selectors/room'

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

export function* fetchMessages(roomRef: any, cursor?: any) {
	const messages: any = {}

	let messagePage = roomRef
		.collection('messages')
		.orderBy('createdAt', 'desc')
		.limit(35) as CollectionReference

	if (cursor) {
		messagePage = messagePage.startAfter(cursor) as CollectionReference
	}

	const messagesQuery: QuerySnapshot = yield call(
		rsf.firestore.getCollection,
		messagePage,
	)

	messagesQuery.forEach((messageDoc: any) => {
		messages[messageDoc.id] = { id: messageDoc.id, ...messageDoc.data() }
	})

	return messages
}

export function* fetchRoom(roomId: string) {
	console.log('try fetch room ', roomId)
	// fetch active room from firestore
	const roomRef = database.collection('rooms').doc(roomId)
	const roomDoc = yield call(rsf.firestore.getDocument, roomRef)

	// if we have such room
	if (roomDoc.exists) {
		const room = roomDoc.data()
		const people: any[] = []

		// get room's people
		const peopleQuery = yield call(
			rsf.firestore.getCollection,
			roomRef.collection('people'),
		)
		peopleQuery.forEach((peopleDoc: any) => {
			people.push({ id: peopleDoc.id, ...peopleDoc.data() })
		})

		// get room's messages first page
		const messages = yield call(fetchMessages, roomRef)

		const canFetchMore = Object.keys(messages).length === 35

		yield put(
			updateRoom({
				id: roomRef.id,
				name: room.name || '-',
				people,
				messages,
				// messageCount: messages.length,
				canFetchMore,
			}),
		)

		yield call(subscribeToLastMessage, roomRef)
	}
}

export function* subscribeToLastMessage(
	roomRef: firebase.firestore.DocumentReference,
) {
	// subscribe to latest message
	const newestMessage = roomRef
		.collection('messages')
		.orderBy('createdAt', 'desc')
		.limit(1) as CollectionReference

	yield fork(rsf.firestore.syncCollection, newestMessage, {
		successActionCreator: (snapshot: any) => syncMessages(snapshot, roomRef.id),
	})
}

export function* fetchMoreMessages(action: AnyAction) {
	const { roomId } = action
	console.log('try fetch room ', roomId)
	// fetch active room from firestore
	const roomRef = database.collection('rooms').doc(roomId)
	const roomDoc = yield call(rsf.firestore.getDocument, roomRef)

	if (roomDoc.exists) {
		yield put(updateRoom({ id: roomId, isFetchingMore: true }))
		// find oldest message
		const earliestMessage = yield select(getEarliestMessageForRoomId(roomId))

		const messages = yield call(
			fetchMessages,
			roomRef,
			earliestMessage.createdAt,
		)

		const canFetchMore = Object.keys(messages).length === 35

		yield put(updateMessages(messages, roomId, canFetchMore))
		yield put(updateRoom({ id: roomId, isFetchingMore: false }))
	}
}

function* fetchMoreMessagesListener() {
	yield takeEvery(types.FETCH_MORE_MESSAGES, fetchMoreMessages)
}

function* joinRoomListener() {
	yield takeEvery(types.JOIN_ROOM_SAGA, joinRoom)
}

function* updateRoomPresencesListener() {
	yield takeEvery(types.UPDATE_ROOM_PRESENCES, updateRoomPresences)
}

export default [
	joinRoomListener(),
	updateRoomPresencesListener(),
	fetchMoreMessagesListener(),
]
