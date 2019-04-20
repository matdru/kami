import { firebase } from "../firebase/firebase";

export const loginSuccess = (uid: string, displayName: string) => ({
  type: "LOGIN",
  uid,
  displayName
});

export const tryLogin = () => {
  return (dispatch: any) => {
    return firebase
      .auth()
      .signInAnonymously()
      .then(response => {
        // console.log(response);
        const { user } = response;

        if (user) {
          const displayName = user.displayName || "Ninja";
          return dispatch(loginSuccess(user.uid, displayName));
        }
      })
      .catch(function(error) {
        console.log({ error });
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
  };
};

export const logout = () => ({
  type: "LOGOUT"
});

export const tryLogout = () => {
  return () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("log out!!!");
      });
  };
};
