import firebase_app from "../config";
import { getFirestore, collection, query, orderBy, limit, getDocs, startAfter } from "firebase/firestore";

const db = getFirestore(firebase_app);

export default async function getPage(
  name: string,
  size: number,
  field: string,
  sort?: "asc" | "desc",
  last?: number | string
) {
  try {
    if (!last) {
      let first = query(collection(db, name), orderBy(field, sort), limit(size));
      return await getDocs(first);
    }
    const next = query(collection(db, name), orderBy(field, sort), startAfter(last), limit(size));
    return await getDocs(next);
  } catch (error) {
    console.log(error);
    return false;
  }
}
