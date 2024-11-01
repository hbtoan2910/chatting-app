import EmojiPicker from "emoji-picker-react";
import "./chat.css";
import { useState, useEffect, useRef } from "react";

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <span>Jane Doe</span>
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
        <div className="message own">
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
        </div>
        <div ref={endRef} />
      </div>
      <div className="bottom">
        <div className="icons">
          <img src="./img.png" alt="" />
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
        <button className="sendButton">Send</button>
      </div>
    </div>
  );
};

export default Chat;
