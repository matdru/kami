import { all } from 'redux-saga/effects'
import initSaga from './initSaga'
import roomSagas from './roomSagas'

export default function* rootSaga() {
	yield all([initSaga(), ...roomSagas])
}
