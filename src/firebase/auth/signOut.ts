import { isExp } from "@/utils/util";
import firebase_app from "../config";
import { getAuth, signOut } from "firebase/auth";

const auth = getAuth(firebase_app);

export default function doSignOut() {
  const currentUserId = auth.currentUser?.uid || "";
  signOut(auth)
    .then(() => {
      if (isExp(currentUserId)) {
        window.localStorage.clear();
      }
      alert("로그아웃 되었습니다.");
    })
    .catch((error) => {
      console.log(error);
    });
}
