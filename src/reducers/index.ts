import authReducer from '../reducers/auth'
import roomsReducer from '../reducers/rooms'
import redirectReducer from '../reducers/redirect'
import { combineReducers } from 'redux'

const reducers = combineReducers({
	auth: authReducer,
	rooms: roomsReducer,
	redirect: redirectReducer,
})

export default reducers
