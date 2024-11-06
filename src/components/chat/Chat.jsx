import EmojiPicker from "emoji-picker-react";
import "./chat.css";
import { useState, useEffect, useRef } from "react";
import useUserStore from "../../lib/userStore";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import useChatStore from "../../lib/chatStore";
import upload from "../../lib/upload";

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [chat, setChat] = useState([]);
  const { currentUser } = useUserStore();
  const { chatId, user } = useChatStore();
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!chatId) return; // Return early if chatId is null or undefined

    const unSub = onSnapshot(doc(db, "chats", chatId), async (res) => {
      setChat(res.data());
      //console.log(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleSend = async () => {
    if (text === "") return;

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }), //If imgUrl is not null or undefined (meaning an image URL exists), { img: imgUrl } is created and spread into the object, adding an img property with the image URL
        }),
      });

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {
        //console.log(id);
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();
          //console.log(userChatsData.chats[chatIndex]);
          //console.log(userChatsData.chats[chatIndex].isSeen);
          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
      setText("");
      setImg({ file: null, url: "" });
    } catch (err) {
      console.log(err);
    }
  };

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImg({
        file,
        url: URL.createObjectURL(file),
      });
    }
  };
  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={user.avatar} alt="" />
          <div className="texts">
            <span>{user.username}</span>
            <p>Lorem ipsum dolor sit amet consectetur.</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className="center">
        {/* <div className="message own">
          <div className="texts">
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. At,
              eaque nemo aperiam impedit dolorum cupiditate sunt quasi
              asperiores nam vero ipsa numquam nobis. Aspernatur tempore ratione
              cupiditate tenetur ipsum vero?
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className="message">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. At,
              eaque nemo aperiam impedit dolorum cupiditate sunt quasi
              asperiores nam vero ipsa numquam nobis. Aspernatur tempore ratione
              cupiditate tenetur ipsum vero?
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className="message own">
          <div className="texts">
            <img
              src="https://images.pexels.com/photos/20780458/pexels-photo-20780458/free-photo-of-honda-super-cub-motorbike.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt=""
            />
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. At,
              eaque nemo aperiam impedit dolorum cupiditate sunt quasi
              asperiores nam vero ipsa numquam nobis. Aspernatur tempore ratione
              cupiditate tenetur ipsum vero?
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className="message">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. At,
              eaque nemo aperiam impedit dolorum cupiditate sunt quasi
              asperiores nam vero ipsa numquam nobis. Aspernatur tempore ratione
              cupiditate tenetur ipsum vero?
            </p>
            <span>1 min ago</span>
          </div>
        </div> */}
        {chat?.messages?.map((message) => (
          <div
            className={
              message.senderId === currentUser.id ? "message own" : "message"
            }
            key={message?.createdAt}
          >
            <div className="texts">
              {message.img && <img src={message.img} alt="" />}
              <p>{message.text}</p>
              {/* <span>1 min ago</span> */}
            </div>
          </div>
        ))}
        {img.url && (
          <div className="message own">
            <div className="texts">
              <img src={img.url} alt="" />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="./img.png" alt="" />
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImg}
          />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input
          id="msgInput"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
        />
        <div className="emoji">
          <img
            src="./emoji.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />

          <div className="picker">
            {/* {open && <EmojiPicker onEmojiClick={handleEmoji} />} */}
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button className="sendButton" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
