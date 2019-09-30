import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions
	.region('europe-west1')
	.https.onRequest((request, response) => {
		response.send('Hello from Firebase!')
	})

// The Firebase Admin SDK to access the Firebase Realtime Database.
admin.initializeApp()

export const addMessage = functions
	.region('europe-west1')
	.https.onRequest(async (req, res) => {
		// Grab the text parameter.
		const qBody = req.query.body
		const roomId = req.query.text

		// TODO create auth helper
		const idToken = req.headers.authorization
		if (idToken) {
			admin
				.auth()
				.verifyIdToken(idToken)
				.then(function(decodedToken) {
					const uid = decodedToken.uid
					// ...
					res.status(200).send({
						uid,
						qBody,
						roomId,
					})
				})
				.catch(function(error) {
					// Handle error
					res.status(400).send('Invalid token')
				})
		} else {
			res.status(400).send(`No auth token provided. -> ${idToken}`)
		}

		console.log(qBody)

		res.send('Hello from Firebase!')

		// Push the new message into the Realtime Database using the Firebase Admin SDK.
		// const snapshot = await admin.firestore().collection(`rooms/${roomId}/messages`).add()

		// Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
		// res.redirect(303, snapshot.ref.toString());
	})

export const sendMessage = functions
	.region('europe-west1')
	.https.onCall((data, context) => {
		// Message text passed from the client.
		const text = data.text
		const roomId = data.roomId
		// Authentication / user information is automatically added to the request.
		if (context.auth) {
			const uid = context.auth.uid
			const name = context.auth.token.name || null
			const picture = context.auth.token.picture || null
			const email = context.auth.token.email || null

			if (uid) {
				return {
					text,
					roomId,
					name,
					picture,
					email,
				}
			}
		} else {
			// Throwing an HttpsError so that the client gets the error details.
			throw new functions.https.HttpsError(
				'failed-precondition',
				'The function must be called ' + 'while authenticated.',
			)
		}

		throw new functions.https.HttpsError('unknown', 'Something went wrong :(')
	})
