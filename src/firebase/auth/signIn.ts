import { FirebaseError } from "firebase/app";
import firebase_app from "../config";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";

const auth = getAuth(firebase_app);

export default async function signIn(email: string, password: string) {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    if (error instanceof FirebaseError) {
      if (error.code == "auth/invalid-email") {
        alert("이메일 형식을 확인해 주세요.");
      }
      if (error.code == "auth/user-not-found") {
        alert("아이디를 확인해 주세요.");
      }
      if (error.code == "auth/wrong-password") {
        alert("비밀번호를 확인해 주세요");
      }
      if (error.code == "auth/too-many-requests") {
        alert("잠시 후 다시 시도해 주세요");
      }
    }
    return false;
  }
}
