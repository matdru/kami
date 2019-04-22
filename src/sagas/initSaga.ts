import { put, select, takeLatest, fork, call } from 'redux-saga/effects'
import database, { firebase, rsf } from '../firebase/firebase'
import { availableRooms, createRoom, syncMessages } from '../actions/rooms'

const byCreatedAt = function(a: any, b: any) {
	// @ts-ignore
	return new Date(a.createdAt) - new Date(b.createdAt)
}

export function* fetchRoomSaga(roomId: string) {
	console.log('try fetch room ', roomId)
	// fetch joined room from firestore
	const roomRef = database.collection('rooms').doc(roomId)
	const roomDoc = yield call(rsf.firestore.getDocument, roomRef)

	// if we have such room
	if (roomDoc.exists) {
		const room = roomDoc.data()
		const people: any[] = []
		const messages: any[] = []

		// get room's people
		const peopleQuery = yield call(
			rsf.firestore.getCollection,
			roomRef.collection('people'),
		)
		peopleQuery.forEach((peopleDoc: any) => {
			people.push({ id: peopleDoc.id, ...peopleDoc.data() })
		})
		console.log({ people })

		// get room's people
		const messagesQuery = yield call(
			rsf.firestore.getCollection,
			roomRef.collection('messages'),
		)
		messagesQuery.forEach((messageDoc: any) => {
			messages.push({
				id: messageDoc.id,
				...messageDoc.data(),
			})
		})
		messages.sort(byCreatedAt)
		console.log({ messages })

		yield put(
			createRoom({
				id: roomRef.id,
				name: room ? room.name : 'Error',
				people,
				messages,
			}),
		)

		// subscribe to messages
		yield fork(rsf.firestore.syncCollection, roomRef.collection('messages'), {
			successActionCreator: (snapshot: any) => syncMessages(snapshot, roomId),
		})
	}
}

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* initSlackerSaga(action: any) {
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
			const task = yield fork(fetchRoomSaga, roomId)
		}

		// if no general room, join that as well
		if(generalRoom && !userRoomIds.includes(generalRoom.id)) {
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

function* mySaga() {
	yield takeLatest('INIT_SLACKER_SAGA', initSlackerSaga)
}

export default mySaga
