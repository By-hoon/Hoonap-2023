import { FirebaseError } from "firebase/app";
import firebase_app from "../config";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

const auth = getAuth(firebase_app);

export default async function signUp(email: string, password: string) {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    if (error instanceof FirebaseError) {
      if (error.code == "auth/email-already-in-use") {
        alert("이미 있는 아이디입니다.");
      }
      if (error.code == "auth/invalid-email") {
        alert("이메일 형식을 확인해 주세요.");
      }
      if (error.code == "auth/weak-password") {
        alert("비밀번호를 다시 확인해 주세요.");
      }
      if (error.code == "auth/too-many-requests") {
        alert("잠시 후 다시 시도해 주세요");
      }
    }
    return false;
  }
}
