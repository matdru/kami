import firebase from 'firebase'
import '@firebase/firestore' // 👈 Don't forget this!
import ReduxSagaFirebase from 'redux-saga-firebase'
const config = {
	apiKey: 'AIzaSyB2tCxT6yP0CWtCbD9JDj3ZKaxxW8T25PI',
	authDomain: 'slacker-c3b01.firebaseapp.com',
	databaseURL: 'https://slacker-c3b01.firebaseio.com',
	projectId: 'slacker-c3b01',
	storageBucket: 'slacker-c3b01.appspot.com',
	messagingSenderId: '286218247810',
}
const firebaseApp = firebase.initializeApp(config)
const rsf = new ReduxSagaFirebase(firebaseApp)
const database = firebase.firestore()
const functionsInstance = firebaseApp.functions('europe-west1')
const githubAuthProvider = new firebase.auth.GithubAuthProvider()
const googleAuthProvider = new firebase.auth.GoogleAuthProvider()

const auth = firebase.auth()

// functions
const functions = {
	sendMessage: functionsInstance.httpsCallable('sendMessage'),
	joinRoom: functionsInstance.httpsCallable('sendMessage')
}

export {
	firebase,
	functions,
	rsf,
	auth,
	githubAuthProvider,
	googleAuthProvider,
	database as default,
}
