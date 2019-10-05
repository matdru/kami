import * as functions from "firebase-functions";

export const getAuth = (context: functions.https.CallableContext) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called " + "while authenticated."
    );
  } else {
    return context.auth;
  }
};

export const genericErrorHandler = (reason: any) => {
  throw new functions.https.HttpsError(
    "internal",
    "Function rejected because of " + reason
  );
};
