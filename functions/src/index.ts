import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as moment from "moment";

import { genericErrorHandler, getAuth } from "./helpers";

// The Firebase Admin SDK to access the Firebase Realtime Database.
admin.initializeApp();

export const sendMessage = functions
  .region("europe-west1")
  .https.onCall((data, context) => {
    // Authentication / user information is automatically added to the request.
    if (context.auth) {
      const uid = context.auth.uid;
      const name = context.auth.token.name || "Ninja";
      const { text, roomId } = data;

      const message = {
        sender: { uid, displayName: name },
        text,
        createdAt: moment.utc().format()
      };

      return admin
        .firestore()
        .collection(`rooms/${roomId}/messages`)
        .add(message)
        .then(response => {
          return response;
        })
        .catch(() => ({
          error: "Error when inserting firestore :("
        }));
    } else {
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called " + "while authenticated."
      );
    }
  });

export const joinRoom = functions
  .region("europe-west1")
  .https.onCall((data, context) => {
    const auth = getAuth(context);

    const uid = auth.uid;
    const name = auth.token.name || "Ninja";
    const { roomId } = data;
    const store = admin.firestore();

    return store
      .doc(`rooms/${roomId}`)
      .get()
      .then(
        snapshot => {
          // TODO how can client and functions share definitions?
          const room = { id: snapshot.id, ...snapshot.data() } as Room;

          if (!room || !snapshot.exists) {
            throw new functions.https.HttpsError(
              "invalid-argument",
              "This room doesn't exist"
            );
          }

          if (room.people && room.people.find(person => person.id === uid)) {
            // TODO figure out leaving and re-entering
            throw new functions.https.HttpsError(
              "already-exists",
              "This room already has this user"
            );
          }

          // add user to room
          const user = {
            name,
            id: uid
          };

          const batch = store.batch();

          batch.set(store.doc(`rooms/${roomId}/people/${user.id}`), user);

          batch.set(store.doc(`users/${user.id}/rooms/${roomId}`), {
            roomName: room.name
          });

          // console.log ( do i have to return this? pepoThink )
          return batch.commit().then(writeResults => {
            console.log({ writeResults });
            return {};
          }, genericErrorHandler);
        },
        // onRejected
        genericErrorHandler
      );
  });

export const leaveRoom = functions
  .region("europe-west1")
  .https.onCall((data, context) => {
    const auth = getAuth(context);

    const uid = auth.uid;
    const { roomId } = data;
    const store = admin.firestore();

    return store
      .doc(`rooms/${roomId}`)
      .get()
      .then(
        snapshot => {
          if (!snapshot.exists) {
            throw new functions.https.HttpsError(
              "invalid-argument",
              "This room doesn't exist"
            );
          }

          // TODO how can client and functions share definitions?
          const room = { id: snapshot.id, ...snapshot.data() } as Room;

          const exisitingUser =
            room.people && room.people.find(person => person.id === uid);

          if (!exisitingUser) {
            // TODO figure out leaving and re-entering
            throw new functions.https.HttpsError(
              "not-found",
              "This room doesnt have such user"
            );
          }

          if (!exisitingUser.active) {
            // TODO figure out leaving and re-entering
            throw new functions.https.HttpsError(
              "invalid-argument",
              "User already left"
            );
          }

          // add user to room
          const user = {
            id: uid,
            active: false
          };

          const batch = store.batch();

          batch.update(store.doc(`rooms/${roomId}/people/${user.id}`), user);

          batch.delete(store.doc(`users/${user.id}/rooms/${roomId}`));

          // console.log ( do i have to return this? pepoThink )
          return batch.commit().then(() => {
            return `${user.id} left ${roomId}`;
          }, genericErrorHandler);
        },
        // onRejected
        genericErrorHandler
      );
  });
