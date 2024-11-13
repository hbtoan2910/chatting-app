import { create } from "zustand";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,
  fetchUserInfo: async (uid) => {
    if (!uid) {
      console.log("UID is null, setting currentUser to null.");
      set({ currentUser: null, isLoading: false });
      return;
    }

    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Fetched User Data:", docSnap.data());
        set({ currentUser: docSnap.data(), isLoading: false });
      } else {
        console.log("No user found, setting currentUser to null.");
        set({ currentUser: null, isLoading: false });
      }
    } catch (err) {
      console.log(err);
    }
  },
}));

export default useUserStore;
