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
    const unSub = onAuthStateChanged(auth, async (user) => {
      console.log("Before Fetch: currentUser =", currentUser);
      await fetchUserInfo(user?.uid);
      console.log("After Fetch: currentUser =", currentUser);
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);

  if (isLoading) {
    console.log("Loading state active");
    return <div className="loading">loading...</div>;
  }
  return (
    // <Router>
    <div className="container">
      {currentUser ? (
        <>
          <List />
          {chatId && <Chat />}
          {chatId && <Detail />}
        </>
      ) : (
        <Login />
      )}
      <Notification />
      {/* <Switch>
          <Route path="/" exact>
            <Login />
          </Route>
          <Route path="/chat">
            {currentUser ? (
              <>
                <List />
                {chatId && <Chat />}
                {chatId && <Detail />}
              </>
            ) : (
              <Login />
            )}
          </Route>
        </Switch> */}
    </div>
    // </Router>
  );
}

export default App;
