import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const Context = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [accountRedirect, setAccountRedirect] = useState(null);


  useEffect(() => {
    if (!user) {
      axios.get("/profile").then(({ data }) => {
        setUser(data);
        setReady(true);
      });
    } 
  });
  return (
    <Context.Provider
      value={{ user, setUser, ready, setReady, setAccountRedirect, accountRedirect}}
    >
      {children}
    </Context.Provider>
  );
};

export default UserContext;
