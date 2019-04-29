import { all } from 'redux-saga/effects'
import initSaga from './initSaga'
import roomSagas from './roomSagas'
// import joinRoomSaga from './joinRoomSaga'

export default function* rootSaga() {
	yield all([initSaga(), ...roomSagas])
}
