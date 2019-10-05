import * as types from '../constants/ActionTypes'
import { Reducer } from 'redux'

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

const roomReducer: Reducer<RoomsState> = (
	state: RoomsState = defaultState,
	action: any,
): RoomsState => {
	switch (action.type) {
		case types.UPDATE_ROOM: {
			console.log({
				oldState: { ...state.active[action.room.id] },
				newState: { ...state.active[action.room.id], ...action.room },
			})
			return {
				...state,
				active: {
					...state.active,
					[action.room.id]: { ...state.active[action.room.id], ...action.room },
				},
			}
		}
		case types.ACTIVE_ROOM:
			return {
				...state,
				active: {
					...state.active,
					[action.room.id]: { ...state.active[action.room.id], ...action.room },
				},
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
							...action.messages,
						},
					},
				},
			}
		default:
			return state
	}
}

export default roomReducer
