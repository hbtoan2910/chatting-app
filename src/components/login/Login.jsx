import { useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import upload from "../../lib/upload";

const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar({ file, url: URL.createObjectURL(file) });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault(); //prevent page reloading after submitting the form
    setRegisterLoading(true);

    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    // Check if an avatar file is uploaded
    if (!avatar.file) {
      toast.error("Please upload an avatar.");
      setRegisterLoading(false);
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const imgUrl = await upload(avatar.file, "avatars");
      if (!imgUrl) {
        toast.warning("Failed to upload avatar.");
      }

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

      toast.success("Account created. You can login now.", {
        onClose: () => {
          e.target.reset(); // Clear all fields in the form
          setAvatar({
            file: null,
            url: "",
          });
        },
      });
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleLogIn = async (e) => {
    e.preventDefault(); //prevent page reloading after submitting the form
    setLoginLoading(true);

    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // auth object comes from Firebase Authentication, and it automatically manages the user's authentication state,
      // including storing session-related data in the browser's storage (typically in localStorage or sessionStorage).

      toast.success(`User with email ${email} logged in properly.`, {
        // onClose: () => {
        //   // Reload the page after the toast has been displayed
        //   window.location.reload();
        // },
      });
    } catch (err) {
      console.error("Error logging in:", err.message);
      toast.error(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="item">
        <h2>Welcome back,</h2>

        <form id="loginForm" onSubmit={handleLogIn}>
          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button disabled={loginLoading}>
            {loginLoading ? (
              <>
                <span className="spinner" />
                <span>loading</span>
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>

      <div className="separator"></div>

      <div className="item">
        <h2>Create an Account</h2>

        <form id="registerForm" onSubmit={handleRegister}>
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
          <button disabled={registerLoading}>
            {registerLoading ? (
              <>
                <span className="spinner" />
                <span>loading</span>
              </>
            ) : (
              "Sign up"
            )}
          </button>
        </form>
        {/* <Link to="/chat">Move to Chat page</Link> */}
      </div>
    </div>
  );
};

export default Login;
