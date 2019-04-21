import { put, select, takeEvery, fork, call } from 'redux-saga/effects'
import { AnyAction } from 'redux'
import database, { firebase, rsf } from '../firebase/firebase'
import {
	availableRooms,
	createRoom,
	updateMessages,
	joinedRoom,
	showError,
	syncMessages,
} from '../actions/rooms'

const byCreatedAt = function(a: any, b: any) {
	// @ts-ignore
	return new Date(a.createdAt) - new Date(b.createdAt)
}

function* joinRoom(action: AnyAction) {
	const { roomId } = action
	const { uid, displayName } = yield select(state => state.auth)
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

		// subscribe to messages in separate fork
		yield fork(rsf.firestore.syncCollection, roomRef.collection('messages'), {
			successActionCreator: (snapshot: any) => syncMessages(snapshot, roomId),
		})

		const person = {
			name: displayName || 'Error',
			id: uid || 'Error',
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

		console.log(room)
		console.log('oops that aint gonna work')

		// TODO get people and messages here

		const roomWithPerson: RoomItem = {
			id: room.id,
			name: room.name,
			people: [person],
			messages: room.messages || [],
		}

		yield put(joinedRoom(roomWithPerson))
	}
}

function* joinRoomSaga() {
	yield takeEvery('JOIN_ROOM_SAGA', joinRoom)
}

export default joinRoomSaga
