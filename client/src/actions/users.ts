import { functions, firestore } from '../firebase/firebase'

import * as types from '../constants/ActionTypes'

// TODO type dispatch

export const getRoomUsers = (roomId: string) => {
	return (dispatch: any) => {
		dispatch({
			type: types.FETCH_ROOM_USERS_REQUEST,
		})
		return functions
			.getRoomUsers({ roomId })
			.then(response => {
				// TODO fix typing here
				const usersObject: Users = {}
				response.data.forEach((record: any) => {
					usersObject[record.id] = record
				})
				console.log(usersObject)
				dispatch({
					type: types.FETCH_ROOM_USERS_SUCCESS,
					payload: usersObject,
				})
			})
			.catch(() => {
				dispatch({
					type: types.FETCH_ROOM_USERS_FAILURE,
				})
			})
	}
}

export const updateUser = (user: User) => {
	return (dispatch: any) => {
		firestore
			.doc(`users/${user.id}`)
			.set(user, { merge: true })
			.then(() => {
				dispatch({
					type: 'USER_UPDATE_SUCCESS',
					payload: user,
				})
			})
	}
}
