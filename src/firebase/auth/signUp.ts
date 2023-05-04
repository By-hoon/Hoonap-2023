import firebase_app from "../config";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

const auth = getAuth(firebase_app);

export default async function signUp(email: string, password: string) {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.log(error);
    return false;
  }
}
