import * as types from '../constants/ActionTypes'
import { Reducer } from 'redux'

const usersReducer: Reducer<Users> = (state: Users = {}, action: any): Users => {
	switch (action.type) {
		case types.FETCH_ROOM_USERS_SUCCESS: {
			return {
				...state,
				...action.payload
			}
		}
		default:
			return state
	}
}

export default usersReducer
