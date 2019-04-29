import { put, select, takeEvery, fork, call } from 'redux-saga/effects'
import { AnyAction } from 'redux'
import database, { firebase, rsf } from '../firebase/firebase'
import { joinedRoom, showError, syncMessages } from '../actions/rooms'
import { fetchRoomSaga } from './initSaga'

const byCreatedAt = function(a: any, b: any) {
	// @ts-ignore
	return new Date(a.createdAt) - new Date(b.createdAt)
}

function* updateRoomPresences(action: AnyAction) {
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

function* joinRoom(action: AnyAction) {
	const { roomId } = action
	const { uid, displayName, photoURL } = yield select(state => state.auth)
	const roomRef = database.doc(`rooms/${roomId}`)

	const roomDoc = yield call(rsf.firestore.getDocument, roomRef)
	const room = <RoomItem>{ id: roomDoc.id, ...roomDoc.data() }

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
		yield call(fetchRoomSaga, roomId)
	}
}

function* joinRoomSaga() {
	yield takeEvery('JOIN_ROOM_SAGA', joinRoom)
}

function* updateRoomPresencesSaga() {
	yield takeEvery('UPDATE_ROOM_PRESENCES', updateRoomPresences)
}

export default [joinRoomSaga(), updateRoomPresencesSaga()]
