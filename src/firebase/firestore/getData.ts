import firebase_app from "../config";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const db = getFirestore(firebase_app);

export default async function getData(name: string) {
  let colRef = collection(db, name);

  let result = null;
  let error = null;

  try {
    result = await getDocs(colRef);
  } catch (e) {
    error = e;
  }

  return { result, error };
}
