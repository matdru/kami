import authReducer from './auth'
import roomsReducer from './rooms'
import redirectReducer from './redirect'
import { combineReducers } from 'redux'

const reducers = combineReducers({
	auth: authReducer,
	rooms: roomsReducer,
	redirect: redirectReducer,
})

export default reducers
