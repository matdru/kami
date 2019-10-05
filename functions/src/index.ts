import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as moment from "moment";

import { genericErrorHandler } from "./helpers";

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
    // check if authenticated
    // TODO solve typescript
    // checkAuth(context);
    if (!context.auth) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called " + "while authenticated."
      );
    }

    const uid = context.auth && context.auth.uid;
    const name = context.auth.token.name || "Ninja";
    const { roomId } = data;
    console.log({ data })
    const store = admin.firestore();

    store
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
            // photoURL: photoURL,
            id: uid
            // unread: 0,
            // lastRead: 0
          };

          store
            .doc(`rooms/${roomId}/people/${user.id}`)
            .set(user)
            .then(roomWriteResult => {
              console.log(roomWriteResult)
              store
                .doc(`users/${user.id}/rooms/${roomId}`)
                .set({ roomName: room.name })
                .then(userWriteResult => {
                  console.log(userWriteResult);
                  return {};
                }, genericErrorHandler);
            }, genericErrorHandler);
        },
        // onRejected
        genericErrorHandler
      );
  });
