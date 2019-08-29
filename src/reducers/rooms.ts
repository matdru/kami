import * as types from '../constants/ActionTypes'

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
		case types.UPDATE_ROOM:
			return {
				...state,
				joined: { ...state.joined, [action.room.id]: action.room },
			}
		case types.JOINED_ROOM:
			return {
				...state,
				joined: { ...state.joined, [action.room.id]: action.room },
			}

		case types.UPDATE_AVAILABLE_ROOMS:
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

		case types.SEND_MESSAGE:
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
		case types.UPDATE_MESSAGES:
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
		default:
			return state
	}
}
