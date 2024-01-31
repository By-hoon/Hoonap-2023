import { isExp } from "@/utils/util";
import firebase_app from "../config";
import { getAuth, signOut } from "firebase/auth";

const auth = getAuth(firebase_app);

export default function doSignOut(resolve: () => void, reject: () => void) {
  const currentUserId = auth.currentUser?.uid || "";
  signOut(auth)
    .then(() => {
      if (isExp(currentUserId)) {
        window.localStorage.clear();
      }
      resolve();
    })
    .catch((error) => {
      console.log(error);
      reject();
    });
}
