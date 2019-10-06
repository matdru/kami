import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as moment from "moment";

import { getAuth } from "./helpers";

admin.initializeApp();

const firestore = admin.firestore();

export const sendMessage = functions
  .region("europe-west1")
  .https.onCall((data, context) => {
    // require auth
    const auth = getAuth(context);

    const uid = auth.uid;
    const name = auth.token.name || "Ninja";
    const { text, roomId } = data;

    const message = {
      sender: { uid, displayName: name },
      text,
      createdAt: moment.utc().format()
    };

    return firestore
      .collection(`rooms/${roomId}/messages`)
      .add(message)
      .then(response => {
        return response;
      })
      .catch(() => ({
        error: "Error when inserting firestore :("
      }));
  });

export const joinRoom = functions
  .region("europe-west1")
  .https.onCall((data, context) => {
    // require auth
    const auth = getAuth(context);

    const uid = auth.uid;
    const name = auth.token.name || "Ninja";
    const { roomId } = data;

    const roomRef = firestore.doc(`rooms/${roomId}`);
    const roomMemberRef = firestore.doc(`rooms/${roomId}/people/${uid}`);

    return firestore.runTransaction(transaction => {
      return transaction.get(roomRef).then(roomDoc => {
        if (!roomDoc.exists) {
          throw new functions.https.HttpsError(
            "invalid-argument",
            "This room doesn't exist"
          );
        }

        const room = { id: roomDoc.id, ...roomDoc.data() } as Room;

        return transaction.get(roomMemberRef).then(roomMemberDoc => {
          if (roomMemberDoc.exists) {
            const roomMember = {
              id: roomMemberDoc.id,
              ...roomMemberDoc.data()
            } as Person;

            if (roomMember.active) {
              throw new functions.https.HttpsError(
                "already-exists",
                "This room already has this user"
              );
            }
          }

          // if we got here, insert user to room
          const user = {
            id: uid,
            name,
            active: true
          };

          // mark user as inactive
          transaction.update(roomMemberRef, user);

          // remove from user's room list
          transaction.set(firestore.doc(`users/${user.id}/rooms/${roomId}`), {
            roomName: room.name
          });
        });
      });
    });
  });

export const leaveRoom = functions
  .region("europe-west1")
  .https.onCall((data, context) => {
    // require auth
    const auth = getAuth(context);

    const uid = auth.uid;
    const { roomId } = data;

    const roomRef = firestore.doc(`rooms/${roomId}`);
    const roomMemberRef = firestore.doc(`rooms/${roomId}/people/${uid}`);

    return firestore.runTransaction(transaction => {
      return transaction
        .get(roomRef)
        .then(roomDoc => {
          if (!roomDoc.exists) {
            throw new functions.https.HttpsError(
              "invalid-argument",
              "This room doesn't exist"
            );
          }

          return transaction.get(roomMemberRef).then(roomMemberDoc => {
            if (!roomMemberDoc.exists) {
              throw new functions.https.HttpsError(
                "not-found",
                "This room doesnt have such user"
              );
            }

            const member = {
              id: roomMemberDoc.id,
              ...roomMemberDoc.data()
            } as Person;

            // TODO figure out this flag
            if (member.active === false) {
              // TODO figure out leaving and re-entering
              throw new functions.https.HttpsError(
                "invalid-argument",
                "User already left"
              );
            }

            const user = {
              id: uid,
              active: false
            };

            // mark user as inactive
            transaction.update(roomMemberRef, user);

            // remove from user's room list
            transaction.delete(
              firestore.doc(`users/${user.id}/rooms/${roomId}`)
            );
          });
        })
        .then(() => {
          console.log("Transaction complete -> user removed from room");
        });
    });
  });
