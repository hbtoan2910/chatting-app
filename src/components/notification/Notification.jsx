import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";

const Notification = () => {
  return (
    <div className="">
      <ToastContainer position="bottom-right" autoClose={1500} />
    </div>
  );
};

export default Notification;
