import EmojiPicker from "emoji-picker-react";
import { toast } from "react-toastify";
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
import { Tooltip } from "react-tooltip";
import { format } from "timeago.js";

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [chat, setChat] = useState([]);
  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();
  // const [img, setImg] = useState({
  //   file: null,
  //   url: "",
  // });
  const [fileData, setFileData] = useState(null);

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

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
    if (text === "" && !fileData) {
      toast.warning("You have to enter message.");
      return;
    }
    let fileUrl = null;

    try {
      if (fileData) {
        const folderName = fileData?.type.startsWith("image/")
          ? "avatars"
          : "files";
        fileUrl = await upload(fileData.file, folderName);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(fileData?.type.startsWith("image/") && { img: fileUrl }),
          ...(fileData &&
            !fileData.type.startsWith("image/") && {
              file: fileUrl,
              fileName: fileData.name,
            }),
          //...(imgUrl && { img: imgUrl }),
          //If imgUrl is not null or undefined (meaning an image URL exists), { img: imgUrl } is created and spread into the object, adding an img property with the image URL
          //The spread operator (...) is necessary in this case because we cannot directly use conditional syntax in object literal notation without it. JavaScript object literals do not support inline conditional properties directly.
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
      setFileData(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // const handleImg = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setImg({
  //       file,
  //       url: URL.createObjectURL(file),
  //     });
  //   }
  // };

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    const maxSizeInMB = 20; // Maximum file size in MB
    const maxSizeInKB = maxSizeInMB * 1024; // Maximum file size in KB

    if (selectedFile) {
      const fileSizeInKB = (selectedFile.size / 1024).toFixed(2); // Convert size to KB
      if (fileSizeInKB > maxSizeInKB) {
        toast.warning(
          "File size must be below 20MB. Please choose a smaller file."
        );
        e.target.value = ""; // Reset the file input
        return;
      }

      setFileData({
        file: selectedFile,
        url: URL.createObjectURL(selectedFile),
        name: selectedFile.name,
        type: selectedFile.type,
        size: (selectedFile.size / 1024).toFixed(2), //in Kb
      });
    }
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{user?.username}</span>
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
              {message.file && (
                <a
                  style={{ color: "black", fontStyle: "italic" }}
                  href={message.file}
                  download={message.fileName}
                >
                  {message.fileName}
                </a>
              )}
              {message.text != "" && <p>{message.text}</p>}
              <span>{format(message.createdAt.toDate())}</span>
              {/* The reason message.createdAt.toDate() works in this code is because createdAt is likely a Firestore Timestamp object, not a native JavaScript Date */}
            </div>
          </div>
        ))}
        {/* {img.url && (
          <div className="message own">
            <div className="texts">
              <img src={img.url} alt="" />
            </div>
          </div>
        )} */}
        {fileData && (
          <div className="message own">
            {fileData.type.startsWith("image/") ? (
              <div className="texts">
                <img src={fileData.url} alt="" />
              </div>
            ) : (
              <div className="texts">
                <p>
                  Ready to send:{" "}
                  <span style={{ color: "black", fontStyle: "italic" }}>
                    {fileData.name} - {fileData.size} KB
                  </span>
                </p>
                <a href={fileData.url} download={fileData.name}>
                  Preview File
                </a>
              </div>
            )}
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img
              data-tooltip-id="img"
              data-tooltip-content="Add a file"
              data-tooltip-place="top"
              src="./img.png"
              alt=""
            />
            <Tooltip id="img" />
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleFile}
          />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input
          id="msgInput"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked
              ? "You cannot send a message"
              : "Type a message..."
          }
          disabled={isCurrentUserBlocked || isReceiverBlocked}
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
        <button
          className="sendButton"
          onClick={handleSend}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
