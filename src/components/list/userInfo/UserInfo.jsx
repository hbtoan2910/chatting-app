import useUserStore from "../../../lib/userStore";
import "./userinfo.css";

const UserInfo = () => {
  const { currentUser } = useUserStore();
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
      </div>
    </div>
  );
};

export default UserInfo;
