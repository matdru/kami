import database, { firebase } from '../firebase/firebase'
// import { history } from "../routers/AppRouter";
import moment from 'moment'
import * as path from 'path'
// import { ipcRenderer } from 'electron';

const byCreatedAt = function(a: any, b: any) {
	// @ts-ignore
	return new Date(a.createdAt) - new Date(b.createdAt)
}

export interface RoomData {
	id?: string;
	name: string;
	people: any;
	messages?: any;
}

export const createRoom = ({ id, name, people, messages = [] }: RoomData) => ({
	type: 'CREATE_ROOM',
	room: {
		id,
		name,
		people,
		messages,
	},
})

export const tryCreateRoom = (roomData: RoomData, showCreateError: any) => {
	return (dispatch: any, getState: any) => {
		console.log('Attempting to create room...')
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
												createRoom({
													id: roomRef.id,
													...roomData,
													people: [roomData.people],
												}),
											)
											const perName = roomData.people.name
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

export const startListening = (roomId: string) => {
	return (dispatch: any, getState: any) => {
		return database
			.collection(`rooms/${roomId}/messages`)
			.onSnapshot(messagesQuery => {
				if (getState().rooms.find((room: Room) => room.id === roomId)) {
					database
						.collection(`rooms/${roomId}/people`)
						.get()
						.then(personQuery => {
							const messages: any[] = []
							messagesQuery.forEach(doc => {
								messages.push({ id: doc.id, ...doc.data() })
							})
							console.log('listener -> ', { messages })
							messages.sort(byCreatedAt)
							dispatch(updateMessages(messages, roomId))
							return
							// dispatch(
							// 	sendMessage(
							// 		{
							// 			...message,
							// 			id: msgSnapshot ? msgSnapshot.key : 'nullSnap',
							// 		},
							// 		roomName,
							// 	),
							// )
							// dispatch(orderRoomsStartState())
							// if (message.sender.displayName !== getState().auth.displayName) {
							// 	// ipcRenderer.send('playNotif', message.sender.displayName, message.text);
							// 	const audio = new Audio('/sounds/notif.mp3')
							// 	audio.play()
							// }
							// const keyword =
							// 	message.status && message.text.split(' ').splice(-1, 1)[0]
							// if (keyword === 'left') {
							// 	dispatch(onLeft(roomName, message.sender.uid))
							// } else if (keyword === 'joined') {
							// 	dispatch(
							// 		onJoined(roomName, personSnapshot.val()[message.sender.uid]),
							// 	)
							// }
							// const personID = getState().auth.uid

							// if (personID === message.sender.uid && keyword !== 'left') {
							// 	database
							// 		.ref(`rooms/${roomName}/people/${personID}`)
							// 		.update({ unread: 0, lastRead: message.createdAt })
							// 		.then(() => {
							// 			dispatch(
							// 				setUnread(roomName, personID, message.createdAt, 0),
							// 			)
							// 		})
							// } else if (
							// 	personID !== message.sender.uid &&
							// 	moment(message.createdAt) >
							// 		moment(personSnapshot.val()[personID].lastRead)
							// ) {
							// 	database
							// 		.ref(`rooms/${roomName}/people/${personID}`)
							// 		.update({
							// 			unread: personSnapshot.val()[personID].unread + 1,
							// 			lastRead: message.createdAt,
							// 		})
							// 		.then(() => {
							// 			dispatch(
							// 				setUnread(
							// 					roomName,
							// 					personID,
							// 					message.createdAt,
							// 					personSnapshot.val()[personID].unread + 1,
							// 				),
							// 			)
							// 		})
							// }
						})
				}
			})
	}
}

const isAlreadyAdded = (data: any, id: string) => {
	for (var key in data) {
		if (data[key].id === id) return true
	}
	return false
}

// export const startJoinRoom = (data: Room, showJoinError: any) => {
// 	return (dispatch: any, getState: any) => {
// 		const state = getState()
// 		return database.ref(`rooms/${data.roomName}`).once('value', snapshot => {
// 			const value = snapshot.val()
// 			const id = data.id || ''
// 			if (value === null) {
// 				return showJoinError('Room not found!')
// 			} else if (value.people && value.people[id]) {
// 				// history.push(`room/${data.roomName}`);
// 			} else {
// 				dispatch(startListening(data.roomName))
// 				const person = {
// 					name: data.name,
// 					id: data.id,
// 					unread: data.unread,
// 					lastRead: 0,
// 				}
// 				let people: any[] = []
// 				let messages: any[] = []
// 				for (var key in value.people) {
// 					people.push({
// 						id: value.people[key].id,
// 						name: value.people[key].name,
// 						unread: value.people[key].unread,
// 						lastRead: value.people[key].lastRead,
// 					})
// 				}
// 				for (var key in value.messages) {
// 					messages.push({
// 						...value.messages[key],
// 					})
// 				}
// 				return database
// 					.ref(`rooms/${data.roomName}/people/${person.id}`)
// 					.set(person)
// 					.then(ref => {
// 						database
// 							.ref(`users/${person.id}/rooms/${data.roomName}`)
// 							.set({ roomName: data.roomName })

// 						dispatch(
// 							createRoom({
// 								people: [...people, person],
// 								name: data.roomName,
// 								messages,
// 							}),
// 						)
// 						const perName = person.name

// 						dispatch(startSendMessage(`${perName} joined`, data.roomName, true))

// 						// history.push(`room/${data.roomName}`);
// 					})
// 			}
// 		})
// 	}
// }

export const sendMessage = (message: any, roomName: string) => ({
	type: 'SEND_MESSAGE',
	message,
	roomName,
})

export const updateMessages = (messages: any, roomId: string) => ({
	type: 'UPDATE_MESSAGES',
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

export const initSlacker = () => {
	return (dispatch: any, getState: any) => {
		// console.log('initializing slacker')
		const uid = getState().auth.uid
		if (uid) {
			// console.log('user found, ', uid)
			const usersRef = database.collection('users')
			return usersRef
				.doc(uid)
				.collection('rooms')
				.get()
				.then(userRoomsQuery => {
					if (!userRoomsQuery.empty) {
						userRoomsQuery.forEach(userRoomDoc => {
							const roomRef = database.collection('rooms').doc(userRoomDoc.id)

							roomRef.get().then(roomDoc => {
								if (roomDoc.exists) {
									const room = roomDoc.data()
									const people: any[] = []
									const messages: any[] = []
									roomRef
										.collection('people')
										.get()
										.then(peopleQuery => {
											peopleQuery.forEach(peopleDoc => {
												people.push(peopleDoc.data())
											})
											console.log({ people })
										})
										.then(() => {
											roomRef
												.collection('messages')
												.get()
												.then(messagesQuery => {
													messagesQuery.forEach(messageDoc => {
														messages.push({
															id: messageDoc.id,
															...messageDoc.data(),
														})
													})
													messages.sort(byCreatedAt)
													console.log({ messages })

													dispatch(
														createRoom({
															id: roomRef.id,
															name: room ? room.name : 'Error',
															people,
															messages,
														}),
													)

													dispatch(startListening(roomRef.id))
												})
										})
								}
							})
						})
					}
				})
		}
	}
}

export const clearState = {
	type: 'CLEAR_STATE',
}

export const leaveRoom = (roomName: string, userId: string) => ({
	type: 'LEAVE_ROOM',
	roomName,
	userId,
})

// export const startLeaveRoom = (roomName: string) => {
// 	return (dispatch: any, getState: any) => {
// 		const user = getState().auth
// 		if (user) {
// 			const userId = user.uid
// 			const displayName = user.displayName
// 			database.ref(`rooms/${roomName}/people/${userId}`).remove()
// 			database.ref(`users/${userId}/rooms/${roomName}`).remove(() => {
// 				dispatch(leaveRoom(roomName, userId))
// 				dispatch(startSendMessage(`${displayName} left`, roomName, true))
// 				// history.push("/join");
// 			})
// 		}
// 	}
// }

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
