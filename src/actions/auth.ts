import { auth, githubAuthProvider } from '../firebase/firebase'

export const loginSuccess = (uid: string, displayName: string) => ({
	type: 'LOGIN',
	uid,
	displayName,
})

export const initAuth = () => {
	return (dispatch: any) => {
		return auth.onAuthStateChanged(user => {
			if (user) {
				// user authenticated, update redux
				if (user) {
					const displayName = user.displayName || 'Ninja'
					return dispatch(loginSuccess(user.uid, displayName))
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
			.then(response => {
				// console.log(response);
				const { user } = response

				if (user) {
					const displayName = user.displayName || 'Ninja'
					return dispatch(loginSuccess(user.uid, displayName))
				}
			})
			.catch(function(error) {
				console.log({ error })
				// Handle Errors here.
				var errorCode = error.code
				var errorMessage = error.message
				// ...
			})
	}
}

export const tryLoginProvider = () => {
	return (dispatch: any) => {
		return auth
			.signInWithPopup(githubAuthProvider)
			.then(response => {
				const { user } = response

				console.log({ user })

				if (user) {
					const displayName = user.displayName || 'Ninja'
					return dispatch(loginSuccess(user.uid, displayName))
				}
			})
			.catch(function(error) {
				console.log({ error })
				// Handle Errors here.
				var errorCode = error.code
				var errorMessage = error.message
				// ...
			})
	}
}

export const logout = () => ({
	type: 'LOGOUT',
})

export const tryLogout = () => {
	return () => {
		return auth.signOut().then(() => {
			console.log('log out!!!')
		})
	}
}
