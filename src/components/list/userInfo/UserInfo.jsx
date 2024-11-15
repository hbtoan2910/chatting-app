import useUserStore from "../../../lib/userStore";
import { auth } from "../../../lib/firebase";
import { toast } from "react-toastify";
import "./userinfo.css";

const UserInfo = () => {
  const { currentUser } = useUserStore();

  const handleLogOut = () => {
    if (currentUser) {
      auth.signOut();
      toast.success(`User ${currentUser.username} logged out.`);
    }
  };

  return (
    <div className="userInfo">
      <div className="user current">
        <img src={currentUser?.avatar} alt="avatar-image" />
        <h2>{currentUser?.username}</h2>
      </div>
      <div className="icons">
        <img src="./more.png" alt="" />
        <img src="./video.png" alt="" />
        <img src="./edit.png" alt="" />
        {currentUser && (
          <button className="logout" onClick={handleLogOut}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
