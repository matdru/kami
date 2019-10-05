import { all } from 'redux-saga/effects'
import initSaga from './initSaga'
import roomSagas from './rooms'

export default function* rootSaga() {
	yield all([initSaga(), ...roomSagas])
}
