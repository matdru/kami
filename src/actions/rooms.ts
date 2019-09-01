import database from '../firebase/firebase'
import moment from 'moment'
// import { ipcRenderer } from 'electron';

import * as types from '../constants/ActionTypes'

const byCreatedAt = function(a: any, b: any) {
	return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
}

export interface RoomData {
	id?: string
	name: string
	people: any
	messages?: any
	messageCount?: number
	canFetchMore?: boolean
}

export const updateRoom = ({
	id,
	name,
	people,
	messages = [],
	canFetchMore,
	messageCount,
}: RoomData) => ({
	type: types.UPDATE_ROOM,
	room: {
		id,
		name,
		people,
		messages,
		canFetchMore,
		messageCount,
	},
})

export const activeRoom = (activeRoom: RoomItem) => ({
	type: types.ACTIVE_ROOM,
	activeRoom,
})

export const tryJoinRoom = (roomId: string) => ({
	type: types.JOIN_ROOM_SAGA,
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
												trySendMessage(
													`${user.displayName} created this room`,
													roomRef.id,
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

export const trySendMessage = (
	text: string,
	roomId: string,
	status: boolean = false,
) => {
	return (_: any, getState: any) => {
		const user = getState().auth
		if (user) {
			const uid = user.uid
			const displayName = user.displayName
			const message = {
				sender: { uid, displayName },
				text,
				createdAt: moment().format(),
				status,
			}
			return database.collection(`rooms/${roomId}/messages`).add(message)
		}
	}
}

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

export const syncMessages = (messagesSnapshot: any, roomId: string) => {
	const messages: any[] = []
	messagesSnapshot.forEach((doc: any) => {
		messages.push({ id: doc.id, ...doc.data() })
	})

	messages.sort(byCreatedAt)
	return updateMessages(messages, roomId)
}

export const updateMessages = (messages: any, roomId: string) => ({
	type: types.UPDATE_MESSAGES,
	messages,
	roomId,
})
