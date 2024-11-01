import { useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db, storage } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import upload from "../../lib/upload";

const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar({ file, url: URL.createObjectURL(file) });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const imgUrl = await upload(avatar.file);

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        id: res.user.uid,
        avatar: imgUrl,
        blocked: [],
      });

      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });

      toast.success("Account created. You can login now.");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };
  const handleSignIn = async (e) => {
    e.preventDefault(); //prevent page reloading after submitting the form
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      //console.log("Logged in user:", userCredential.user);
      toast.success("User logged in properly.");
    } catch (error) {
      console.error("Error logging in:", error.message);
    }
  };
  return (
    <div className="login">
      <div className="item">
        <h2>Welcome back,</h2>

        <form onSubmit={handleSignIn}>
          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button disabled={false}>Sign in</button>
        </form>
      </div>

      <div className="separator"></div>

      <div className="item">
        <h2>Create an Account</h2>

        <form onSubmit={handleRegister}>
          <label htmlFor="file">
            <img src={avatar.url || "./avatar.png"} alt="" />
            Upload an image
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleAvatar}
          />
          <input type="text" placeholder="Username" name="username" />
          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button disabled={false}>Sign up</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
