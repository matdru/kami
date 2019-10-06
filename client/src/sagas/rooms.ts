import { put, select, takeEvery, call } from 'redux-saga/effects'
import { AnyAction } from 'redux'
import database, { rsf, functions } from '../firebase/firebase'
import * as types from '../constants/ActionTypes'
import { showError, updateRoom } from '../actions/rooms'
import { fetchMessages, subscribeToLastMessage } from './messages'

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

	// call function that joins room
	const response = yield call(functions.joinRoom, { roomId })
	console.log({ response })

	// fetch full room and subscribe
	yield call(fetchRoom, roomId)
}

export function* leaveRoom(action: AnyAction) {
	const { roomId } = action

	console.log('calling leave function...')

	// call function that joins room
	const response = yield call(functions.leaveRoom, { roomId })

	console.log({ response })

	// fetch full room and subscribe
	// yield call(fetchRoom, roomId)
}

export function* fetchRoom(roomId: string) {
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

function* joinRoomListener() {
	yield takeEvery(types.JOIN_ROOM_SAGA, joinRoom)
}

function* leaveRoomListener() {
	yield takeEvery(types.LEAVE_ROOM_SAGA, leaveRoom)
}

function* updateRoomPresencesListener() {
	yield takeEvery(types.UPDATE_ROOM_PRESENCES, updateRoomPresences)
}

export default [
	joinRoomListener(),
	leaveRoomListener(),
	updateRoomPresencesListener(),
]
