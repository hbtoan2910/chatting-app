import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import List from "./list/List";
import Detail from "./detail/Detail";
import Chat from "./chat/Chat";
import Login from "./login/Login";
import Notification from "./notification/Notification";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import useUserStore from "../lib/userStore";
import useChatStore from "../lib/chatStore";

function App() {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  if (isLoading) return <div className="loading">loading...</div>;

  return (
    <Router>
      <div className="container">
        {/* {currentUser ? (
        <>
          <List />
          {chatId && <Chat />}
          {chatId && <Detail />}
        </>
      ) : (
        <Login />
      )}
      <Notification /> */}
        <Switch>
          {/* Redirect to /chat after login if chatId exists */}
          <Route path="/" exact>
            {currentUser ? <Redirect to="/chat" /> : <Login />}
          </Route>
          {/* Route for /chat page */}
          <Route path="/chat">
            {currentUser ? (
              <>
                <List />
                {chatId && <Chat />}
                {chatId && <Detail />}
              </>
            ) : (
              <Redirect to="/" />
            )}
          </Route>
          <Route path="/login">
            <Login />
          </Route>
        </Switch>
        <Notification />
      </div>
    </Router>
  );
}

export default App;
