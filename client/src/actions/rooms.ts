import database from '../firebase/firebase'
// import { ipcRenderer } from 'electron';

import { trySendMessage } from './messages'

import * as types from '../constants/ActionTypes'

// const byCreatedAt = function(a: any, b: any) {
// 	return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
// }

export interface RoomData {
	id?: string
	name?: string
	people?: any
	messages?: any
	messageCount?: number
	canFetchMore?: boolean
	isFetchingMore?: boolean
}

export const updateRoom = (room: RoomData) => ({
	type: types.UPDATE_ROOM,
	room,
})

export const activeRoom = (activeRoom: RoomItem) => ({
	type: types.ACTIVE_ROOM,
	activeRoom,
})

export const tryJoinRoom = (roomId: string) => ({
	type: types.JOIN_ROOM_SAGA,
	roomId,
})

export const tryLeaveRoom = (roomId: string) => ({
	type: types.LEAVE_ROOM_SAGA,
	roomId,
})

export const tryCreateRoom = (roomData: RoomData, showCreateError: any) => {
	return (dispatch: any, getState: () => StoreState) => {
		const room = {
			name: roomData.name,
		}
		// get all rooms
		return database
			.collection('rooms')
			.get()
			.then(snapshot => {
				const rooms: Room[] = []
				snapshot.forEach(doc => {
					console.log(doc)
					// @ts-ignore
					const room: Room = doc.data()
					rooms.push({
						...room,
					})
				})
				// if no room with this name
				if (!rooms.find(r => r.name === room.name)) {
					return (
						database
							.collection('rooms')
							.add(room)
							// create this room and
							.then(roomRef => {
								return (
									database
										.collection(`rooms/${roomRef.id}/people`)
										.doc(roomData.people.id)
										// assign people to it?
										.set(roomData.people)
										.then(() => {
											database
												.collection(`users/${roomData.people.id}/rooms`)
												.doc(roomRef.id)
												.set({ roomName: room.name })

											dispatch(
												updateRoom({
													id: roomRef.id,
													...roomData,
													people: [roomData.people],
												}),
											)

											const user = getState().auth
											if (user) {
												dispatch(
													trySendMessage(
														`${user.displayName} created this room`,
														roomRef.id,
													),
												)
											}
										})
								)
							})
					)
				} else {
					return showCreateError('Room name not available!')
				}
			})
	}
}

// saga
export const tryFetchMoreMessages = (roomId: string) => ({
	type: types.FETCH_MORE_MESSAGES_SAGA,
	roomId,
})

export const availableRooms = (rooms: RoomItem[]) => ({
	type: types.UPDATE_AVAILABLE_ROOMS,
	rooms,
})

export const initSlacker = () => ({
	type: types.INIT_SLACKER_SAGA,
})

export const showError = (message: string) => ({
	type: 'ERROR_MESSAGE',
	message,
})

export const clearState = {
	type: 'CLEAR_STATE',
}

export const leaveRoom = (roomName: string, userId: string) => ({
	type: 'LEAVE_ROOM',
	roomName,
	userId,
})

// need this for listener saga
export const updateMessagesFromSnapshot = (messagesSnapshot: any, roomId: string) => {
	const messages: Messages = {}
	messagesSnapshot.forEach((doc: any) => {
		messages[doc.id] = { id: doc.id, ...doc.data() }
	})

	return updateMessages(messages, roomId)
}

export const updateMessages = (
	messages: any,
	roomId: string,
	canFetchMore: boolean = true,
) => ({
	type: types.UPDATE_MESSAGES,
	messages,
	canFetchMore,
	roomId,
})
