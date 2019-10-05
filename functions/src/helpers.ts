import * as functions from "firebase-functions";

export const checkAuth = (context: functions.https.CallableContext) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called " + "while authenticated."
    );
  } else {
    return true;
  }
};

export const genericErrorHandler = (reason: any) => {
  throw new functions.https.HttpsError(
    "internal",
    "Function rejected because of " + reason
  );
};
