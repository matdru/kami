import * as types from '../constants/ActionTypes'

interface RoomsState {
	active: {
		[key: string]: RoomItem
	}
	available: {
		[key: string]: RoomItem
	}
}

const defaultState: RoomsState = {
	active: {},
	available: {},
}

export default (state: RoomsState = defaultState, action: any) => {
	switch (action.type) {
		case types.UPDATE_ROOM:
			return {
				...state,
				active: { ...state.active, [action.room.id]: action.room },
			}
		case types.ACTIVE_ROOM:
			return {
				...state,
				active: { ...state.active, [action.room.id]: action.room },
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
				active: {
					...state.active,
					[action.roomId]: {
						...[state.active[action.roomId]],
						messages: {
							...state.active[action.roomId].messages,
							[action.message.id]: action.message,
						},
					},
				},
			}
		case types.UPDATE_MESSAGES:
			return {
				...state,
				active: {
					...state.active,
					[action.roomId]: {
						...state.active[action.roomId],
						messages: {
							...state.active[action.roomId].messages,
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
