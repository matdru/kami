import { all } from 'redux-saga/effects'
import initSaga from './initSaga'
import joinRoomSaga from './joinRoomSaga'

export default function* rootSaga() {
	yield all([initSaga(), joinRoomSaga()])
}
