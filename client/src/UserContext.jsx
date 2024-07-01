import axios from "axios";
import React, { createContext, useEffect, useReducer } from "react";

// Define initial state
const initialState = {
  user: null,
  ready: false,
  accountRedirect: null,
};

// Define reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload, ready: true };
    case "SET_READY":
      return { ...state, ready: action.payload };
    case "SET_ACCOUNT_REDIRECT":
      return { ...state, accountRedirect: action.payload };
    default:
      return state;
  }
};

export const Context = createContext();

const UserContext = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!state.user) {
      axios.get("/profile").then(({ data }) => {
        dispatch({ type: "SET_USER", payload: data });
      });
    }
  }, [state.user]);

  return (
    <Context.Provider
      value={{
        user: state.user,
        setUser: (user) => dispatch({ type: "SET_USER", payload: user }),
        ready: state.ready,
        setReady: (ready) => dispatch({ type: "SET_READY", payload: ready }),
        accountRedirect: state.accountRedirect,
        setAccountRedirect: (redirect) =>
          dispatch({ type: "SET_ACCOUNT_REDIRECT", payload: redirect }),
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default UserContext;
