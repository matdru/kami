import * as firebase from "firebase";

const config = {
  apiKey: "AIzaSyB2tCxT6yP0CWtCbD9JDj3ZKaxxW8T25PI",
  authDomain: "slacker-c3b01.firebaseapp.com",
  databaseURL: "https://slacker-c3b01.firebaseio.com",
  projectId: "slacker-c3b01",
  storageBucket: "slacker-c3b01.appspot.com",
  messagingSenderId: "286218247810"
};

firebase.initializeApp(config);

const database = firebase.firestore();
// const githubAuthProvider = new firebase.auth.GithubAuthProvider();

export { firebase, database as default };
