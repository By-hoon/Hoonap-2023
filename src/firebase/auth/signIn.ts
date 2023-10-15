import { FirebaseError } from "firebase/app";
import firebase_app from "../config";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";

const auth = getAuth(firebase_app);

export default async function signIn(email: string, password: string) {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    if (error instanceof FirebaseError) {
      return error.code;
    }
    return "";
  }
}
