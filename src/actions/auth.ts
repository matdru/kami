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
				console.log('user from saved whatever ?', user)

				if (user) {
					const displayName = user.displayName || 'Ninja'
					return dispatch(loginSuccess(user.uid, displayName))
				}
			} else {
				console.log('user is undefined here lol')
				tryLogin()(dispatch)

				// which means we have to sign ppl anonymously and then they can sign in later

				// Implement logic to trigger the login dialog here or redirect to sign-in page.
				// e.g. showDialog()
			}
		})
	}
}

export const tryLogin = () => {
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
