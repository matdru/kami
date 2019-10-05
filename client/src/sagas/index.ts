import { all } from 'redux-saga/effects'
import initSaga from './initSaga'
import roomSagas from './rooms'
import messageSaga from './messages'

export default function* rootSaga() {
	yield all([initSaga(), ...roomSagas, ...messageSaga])
}
