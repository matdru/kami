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

export const joinedRoom = (joinedRoom: RoomItem) => ({
	type: types.JOINED_ROOM,
	joinedRoom,
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
											// const perName = roomData.people.name
											// dispatch(
											// 	startSendMessage(
											// 		`${perName} created this room`,
											// 		room.name,
											// 		true,
											// 	),
											// ).then(() => {
											// 	dispatch(startListening(room.name))
											// 	// history.push(`/room/${room.name}`);
											// })
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

export const showError = (message: string) => ({
	type: 'ERROR_MESSAGE',
	message,
})

export const updateMessages = (messages: any, roomId: string) => ({
	type: types.UPDATE_MESSAGES,
	messages,
	roomId,
})

export const trySendMessage = (
	text: string,
	roomId: string,
	status: boolean = false,
) => {
	return (dispatch: any, getState: any) => {
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

export const orderRoomsStartState = () => ({
	type: 'ORDER_ROOMS_START_STATE',
})

export const availableRooms = (rooms: RoomItem[]) => ({
	type: types.UPDATE_AVAILABLE_ROOMS,
	rooms,
})

export const initSlacker = () => ({
	type: types.INIT_SLACKER_SAGA,
})

export const clearState = {
	type: 'CLEAR_STATE',
}

export const leaveRoom = (roomName: string, userId: string) => ({
	type: 'LEAVE_ROOM',
	roomName,
	userId,
})

export const clearUnread = (
	roomName: string,
	uid: string,
	time: any,
	unread: number,
) => ({
	type: 'CLEAR_UNREAD',
	roomName,
	uid,
	time,
	unread,
})

export const setUnread = (
	roomName: string,
	uid: string,
	time: any,
	unread: number,
) => {
	return (dispatch: any) => {
		dispatch(clearUnread(roomName, uid, time, unread))
	}
}

// export const startClearUnread = (roomName: string) => {
// 	return (dispatch: any, getState: any) => {
// 		// let time = moment().endOf("month");
// 		const uid = getState().auth.uid
// 		if (uid) {
// 			const time = moment().format()
// 			return database
// 				.ref(`rooms/${roomName}/people/${uid}`)
// 				.update({
// 					unread: 0,
// 					lastRead: time,
// 				})
// 				.then(() => {
// 					dispatch(clearUnread(roomName, uid, time, 0))
// 				})
// 		}
// 	}
// }

export const onLeft = (roomName: string, personID: string) => ({
	type: 'ON_LEFT',
	roomName,
	personID,
})

export const onJoined = (roomName: string, person: any) => ({
	type: 'ON_JOINED',
	roomName,
	person,
})

export const syncMessages = (messagesSnapshot: any, roomId: string) => {
	const messages: any[] = []
	messagesSnapshot.forEach((doc: any) => {
		messages.push({ id: doc.id, ...doc.data() })
	})

	messages.sort(byCreatedAt)
	return updateMessages(messages, roomId)
}
