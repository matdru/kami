import { put, select, takeLatest, fork, call } from 'redux-saga/effects'
import database, { firebase, rsf } from '../firebase/firebase'
import { availableRooms } from '../actions/rooms'
import { fetchRoom } from './roomSagas'

// worker Saga
function* initSlacker(action: any) {
	const auth = yield select(state => state.auth)

	if (!auth.uid) {
		console.log('no auth!')
		return
	}

	// fetch all rooms
	const roomsPromise = database.collection('rooms').get()

	const roomsQuery: firebase.firestore.QuerySnapshot = yield roomsPromise
	const rooms: RoomItem[] = []
	roomsQuery.forEach(doc => {
		const room = {
			id: doc.id,
			...doc.data(),
		}
		// @ts-ignore
		rooms.push(room)
	})

	yield put(availableRooms(rooms))
	const generalRoom = rooms.find(room => room.name === 'general')

	// get user rooms
	const userRoomsQuery = yield call(
		rsf.firestore.getCollection,
		`users/${auth.uid}/rooms`,
	)

	if (!userRoomsQuery.empty) {
		const userRoomIds: string[] = []
		userRoomsQuery.forEach((userRoomDoc: any) =>
			userRoomIds.push(userRoomDoc.id),
		)

		// fetch each joined room
		for (let roomId of userRoomIds) {
			yield fork(fetchRoom, roomId)
		}

		// if no general room, join that as well
		if (generalRoom && !userRoomIds.includes(generalRoom.id)) {
			yield put({
				type: 'JOIN_ROOM_SAGA',
				roomId: generalRoom.id,
				room: generalRoom,
			})
		}
	} else {
		if (generalRoom) {
			yield put({
				type: 'JOIN_ROOM_SAGA',
				roomId: generalRoom.id,
				room: generalRoom,
			})
		}
	}
}

function* initSlackerListner() {
	yield takeLatest('INIT_SLACKER_SAGA', initSlacker)
}

export default initSlackerListner
