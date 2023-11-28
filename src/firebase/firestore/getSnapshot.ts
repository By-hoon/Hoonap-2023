import { Dispatch, SetStateAction } from "react";
import firebase_app from "../config";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";

const db = getFirestore(firebase_app);

export default function getSnapshot(
  name: string,
  id: string,
  setData: Dispatch<SetStateAction<any>>,
  process?: (data: { [key: string]: any }) => {}
) {
  let docRef = doc(db, name, id);

  const unsub = onSnapshot(docRef, (doc) => {
    const curData = doc.data() as { [key: string]: any };

    if (!process) {
      setData(curData);
      return;
    }

    setData(process(curData));
  });

  return unsub;
}
