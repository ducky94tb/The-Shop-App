export const AUTHENTICATE = "AUTHENTICATE";

const API_KEY = "AIzaSyAk7HvHcV7WjL91GIL-bJEHAfC2Xe0YcUA";

export const authenticate = (isLogin, email, password) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:${
          isLogin ? "signInWithPassword" : "signUp"
        }?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true,
          }),
        }
      );
      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error.message);
      }
      dispatch({
        type: AUTHENTICATE,
        token: resData.idToken,
        userId: resData.localId,
      });
    } catch (err) {
      throw err;
    }
  };
};
