import useUserStore from "../../lib/userStore";
import "./detail.css";
import { auth, db } from "../../lib/firebase";
import { toast } from "react-toastify";
import useChatStore from "../../lib/chatStore";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

const Detail = () => {
  const [displayPhotos, setDisplayPhotos] = useState(false);
  const { currentUser } = useUserStore();
  const { chatId, user, changeBlock, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();
  const [messages, setMessages] = useState([]);

  const handleBlock = async () => {
    if (!user) return;
    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
    } catch (err) {
      console.log(err);
    }
    changeBlock();
  };

  const handleLogOut = () => {
    if (currentUser) {
      auth.signOut();
      toast.success(`User ${currentUser.username} logged out.`);
    }
  };

  useEffect(() => {
    if (!chatId) return; // Return early if chatId is null or undefined

    const unSub = onSnapshot(doc(db, "chats", chatId), async (res) => {
      const messagesWithImg = res.data().messages.filter((msg) => msg.img);
      setMessages(messagesWithImg);
      //console.log(messages);
      //console.log(messagesWithImg);
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const getFileNameFromFirebaseUrl = (url) => {
    try {
      // Decode the URL to handle special characters
      const decodedUrl = decodeURIComponent(url);
      // Extract the file name after 'o/' and before '?'
      const fileName = decodedUrl.split("/o/avatars/")[1].split("?")[0];
      return fileName;
    } catch (error) {
      console.error("Invalid Firebase Storage URL:", error);
      return null;
    }
  };
  const handleDownload = async (url) => {
    try {
      console.log(url);
      const response = await fetch(url); // Fetch the file
      const blob = await response.blob(); // Convert the response to a Blob
      const objectURL = URL.createObjectURL(blob); // Create a temporary object URL
      console.log(objectURL);
      const link = document.createElement("a");
      link.href = objectURL; // Use the object URL
      link.download = getFileNameFromFirebaseUrl(url); // Set the file name
      console.log(link);
      link.click(); // Trigger the download
      URL.revokeObjectURL(objectURL); // Clean up the object URL
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const togglePhotos = () => {
    setDisplayPhotos((prev) => !prev);
  };
  return (
    <div className="detail">
      <div className="user">
        <img src={user?.avatar || "./avatar.png"} alt="user-avatar" />
        <h2>{user?.username}</h2>
        <p>Lorem ipsum dolor sit amet.</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared photos</span>
            <img
              src={displayPhotos ? "./arrowDown.png" : "/arrowUp.png"}
              alt=""
              onClick={() => togglePhotos()}
            />
          </div>
          <div
            className="photos"
            style={{ display: displayPhotos ? "block" : "none" }}
          >
            {/* <div className="photoItem">
              <div className="photoDetail">
                <img
                  src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
                  alt=""
                />
                <span>photo_2024_2.png</span>
              </div>
              <img src="./download.png" alt="" className="icon" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img
                  src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
                  alt=""
                />
                <span>photo_2024_2.png</span>
              </div>
              <img src="./download.png" alt="" className="icon" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img
                  src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
                  alt=""
                />
                <span>photo_2024_2.png</span>
              </div>
              <img src="./download.png" alt="" className="icon" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img
                  src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
                  alt=""
                />
                <span>photo_2024_2.png</span>
              </div>
              <img src="./download.png" alt="" className="icon" />
            </div> */}
            {messages &&
              messages.map((message, index) => (
                <div className="photoItem" key={index}>
                  <div className="photoDetail">
                    <img src={message.img} alt="" />
                    <span>{getFileNameFromFirebaseUrl(message.img)}</span>
                  </div>
                  <img
                    src="./download.png"
                    alt=""
                    className="icon"
                    onClick={() => handleDownload(message.img)}
                  />
                </div>
              ))}
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
      </div>
      <div className="bottom-btn">
        <button onClick={() => handleBlock()}>
          {isCurrentUserBlocked
            ? "You are blocked!"
            : isReceiverBlocked
            ? "User blocked"
            : "Block User"}
        </button>
        <button className="logout" onClick={handleLogOut}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Detail;
