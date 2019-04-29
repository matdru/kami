export default (state = {}, action: any) => {
  switch (action.type) {
    case "LOGIN":
      return {
        uid: action.uid,
        ...action.userData,
      };
    case "LOGOUT":
      return {};
    default:
      return state;
  }
};
