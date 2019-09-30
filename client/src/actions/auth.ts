import {
	auth,
	githubAuthProvider,
	googleAuthProvider,
} from '../firebase/firebase'

import * as types from '../constants/ActionTypes'

export const loginSuccess = (uid: string, userData: any) => ({
	type: types.LOGIN_SUCCESS,
	uid,
	userData,
})

export const loginError = (error: any) => ({
	type: types.LOGIN_SUCCESS,
	error
})

export const initAuth = () => {
	return (dispatch: any) => {
		return auth.onAuthStateChanged(user => {
			if (user) {
				// user authenticated, update redux
				if (user) {
					const userData = {
						displayName: user.displayName || 'Ninja',
						email: user.email,
						photoURL: user.photoURL,
					}
					return dispatch(loginSuccess(user.uid, userData))
				}
			} else {
				// no saved user, create shadow
				tryLoginAnonymously()(dispatch)
			}
		})
	}
}

export const tryLoginAnonymously = () => {
	return (dispatch: any) => {
		return auth
			.signInAnonymously()
			.then(() => {
				// console.log(response);
				// const { user } = response

				// if (user) {
				// 	const displayName = user.displayName || 'Ninja'
				// 	return dispatch(loginSuccess(user.uid, displayName))
				// }
			})
			.catch(function(error) {
				console.log({ error })

				return dispatch(loginError({ error }))
			})
	}
}

export const tryLoginProvider = (providerName: string) => {
	return (dispatch: any) => {
		// pick login provider
		let provider = null
		if (providerName === 'github') {
			provider = githubAuthProvider
		} else if (providerName === 'google') {
			provider = googleAuthProvider
		} else {
			return Promise.reject('Invalid auth provider')
		}

		// TODO check if user exits maybe?

		return auth
			.signInWithPopup(provider)
			.then(response => {
				const { user } = response

				console.log({ user })

				// go through user rooms and update people collection with name and picture?

				if (user) {
					return dispatch({
						type: types.UPDATE_USER_ROOM_PRESENCE,
					})
				}
			})
			.catch(function(error) {
				console.log({ error })
				
				return dispatch(loginError({ error }))
			})
	}
}

export const logout = () => ({
	type: types.LOGOUT_SUCCESS,
})

export const tryLogout = () => {
	return () => {
		return auth.signOut().then(() => {
			console.log('log out!!!')
		})
	}
}
