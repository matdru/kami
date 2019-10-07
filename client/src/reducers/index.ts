import authReducer from './auth'
import roomsReducer from './rooms'
import redirectReducer from './redirect'
import usersReducer from './users'
import { combineReducers } from 'redux'

const reducers = combineReducers({
	auth: authReducer,
	rooms: roomsReducer,
	users: usersReducer,
	redirect: redirectReducer,
})

export default reducers
