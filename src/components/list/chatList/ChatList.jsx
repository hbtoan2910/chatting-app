import { useEffect, useState } from "react";
import "./chatlist.css";
import "./addUser/AddUser";
import AddUser from "./addUser/AddUser";
import useUserStore from "../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import useChatStore from "../../../lib/chatStore";

const ChatList = () => {
  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState([]);
  const { currentUser } = useUserStore();
  const { changeChat } = useChatStore();

  useEffect(() => {
    //onSnapshot creates a REALTIME listener on 'userchats' collection
    const unsub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const items = res.data().chats;

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          const user = userDocSnap.data(); //this user is chat-partner-user
          return { ...item, user }; //enrich chat obj with partner info (username, avatar,...)
        });

        const chatData = await Promise.all(promises);
        //console.log(chatData);
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => {
      unsub();
    };
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });
    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );
    userChats[chatIndex].isSeen = true;
    const userChatsRef = doc(db, "userchats", currentUser.id);
    try {
      updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input type="text" placeholder="Search" />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt=""
          className="add"
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>

      {/* <div className="item">
        <img src={currentUser.avatar} alt="" />
        <div className="texts">
          <span>{currentUser.username}</span>
          <p>Hello</p>
        </div>
      </div>
      <div className="item">
        <img src={currentUser.avatar} alt="" />
        <div className="texts">
          <span>{currentUser.username}</span>
          <p>Hello</p>
        </div>
      </div>
      <div className="item">
        <img src={currentUser.avatar} alt="" />
        <div className="texts">
          <span>{currentUser.username}</span>
          <p>Hello</p>
        </div>
      </div> */}
      {chats.map((chat) => (
        <div
          className="item"
          key={chat.chatId}
          onClick={() => handleSelect(chat)}
          style={{
            backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
          }}
        >
          <p>{String(chat.isSeen)}</p>
          <img src={chat.user.avatar} alt="" />
          <div className="texts">
            <span>{chat.user.username}</span>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))}
      {addMode && <AddUser />}
    </div>
  );
};

export default ChatList;
