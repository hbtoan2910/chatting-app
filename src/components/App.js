import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { AuthProvider } from "../contexts/AuthContext";
import List from "./list/List";
import Detail from "./detail/Detail";
import Chat from "./chat/Chat";
import Login from "./login/Login";
import Notification from "./notification/Notification";

function App() {
  const user = false;

  return (
    <div className="container">
      {user ? (
        <>
          <List />
          <Chat />
          <Detail />
        </>
      ) : (
        <Login />
      )}
      <Notification />
    </div>
  );
}

export default App;
