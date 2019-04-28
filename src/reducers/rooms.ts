import moment from 'moment'
interface RoomsState {
	joined: {
		[key: string]: RoomItem
	}
	available: {
		[key: string]: RoomItem
	}
}

const defaultState: RoomsState = {
	joined: {},
	available: {},
}

export default (state: RoomsState = defaultState, action: any) => {
	switch (action.type) {
		case 'CREATE_ROOM':
			return {
				...state,
				joined: { ...state.joined, [action.room.id]: action.room },
			}
		case 'JOINED_ROOM':
			return {
				...state,
				joined: { ...state.joined, [action.room.id]: action.room },
			}

		case 'AVAILABLE_ROOMS':
			return {
				...state,
				available: {
					...action.rooms.reduce(
						(acc: any, value: RoomItem) => ({
							...acc,
							[value.id]: value,
						}),
						{},
					),
				},
			}

		case 'SEND_MESSAGE':
			return {
				...state,
				joined: {
					...state.joined,
					[action.roomId]: {
						...[state.joined[action.roomId]],
						messages: {
							...state.joined[action.roomId].messages,
							[action.message.id]: action.message,
						},
					},
				},
			}
		case 'UPDATE_MESSAGES':
			return {
				...state,
				joined: {
					...state.joined,
					[action.roomId]: {
						...state.joined[action.roomId],
						messages: {
							...state.joined[action.roomId].messages,
							...action.messages.reduce(
								(acc: any, message: Message) => ({
									...acc,
									[message.id]: message,
								}),
								{},
							),
						},
					},
				},
			}

		// case 'CLEAR_UNREAD':
		// 	return state.map(room => {
		// 		if (room.name === action.roomName) {
		// 			const people = room.people.map((person: Person) => {
		// 				if (person.id === action.uid) {
		// 					return {
		// 						...person,
		// 						unread: action.unread,
		// 						lastRead: action.time,
		// 					}
		// 				} else {
		// 					return person
		// 				}
		// 			})
		// 			return { ...room, people }
		// 		} else {
		// 			return room
		// 		}
		// 	})

		// case 'LEAVE_ROOM':
		// 	return state.filter(room => {
		// 		return room.name !== action.roomName
		// 	})
		// case 'CLEAR_STATE':
		// 	return []
		default:
			return state
	}
}
