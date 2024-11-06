import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
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
    </div>
  );
}

export default App;
