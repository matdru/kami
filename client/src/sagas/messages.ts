import { put, select, takeEvery, call, fork } from 'redux-saga/effects'
import { AnyAction } from 'redux'
import database, { rsf } from '../firebase/firebase'
import * as types from '../constants/ActionTypes'
import {
	updateRoom,
	updateMessagesFromSnapshot,
	updateMessages,
} from '../actions/rooms'
import { CollectionReference, QuerySnapshot } from '@firebase/firestore-types'
import { getEarliestMessageForRoomId } from '../selectors/room'

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

		yield put(updateMessages(messages, roomId))
		yield put(updateRoom({ id: roomId, isFetchingMore: false, canFetchMore }))
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
		successActionCreator: (snapshot: any) => updateMessagesFromSnapshot(snapshot, roomRef.id),
	})
}

function* fetchMoreMessagesListener() {
	yield takeEvery(types.FETCH_MORE_MESSAGES_SAGA, fetchMoreMessages)
}

export default [
	fetchMoreMessagesListener(),
]
