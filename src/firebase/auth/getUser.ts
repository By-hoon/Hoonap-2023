import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebase_app from "../config";

const auth = getAuth(firebase_app);

export default function getUser() {
  const user = auth.currentUser;
  if (!user) {
    return false;
  }
  return user;
}
