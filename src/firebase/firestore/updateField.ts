import firebase_app from "../config";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

const db = getFirestore(firebase_app);

export default async function updateField(name: string, id: string, field: string, data: any) {
  let docRef = doc(db, name, id);

  try {
    switch (field) {
      case "storyIds": {
        await updateDoc(docRef, {
          storyIds: data,
        });
        return;
      }
      case "paths": {
        await updateDoc(docRef, {
          paths: data,
        });
        return;
      }
      case "fileUrls": {
        await updateDoc(docRef, {
          fileUrls: data,
        });
        return;
      }
      case "images": {
        await updateDoc(docRef, {
          images: data,
        });
        return;
      }
      case "title": {
        await updateDoc(docRef, {
          title: data,
        });
        return;
      }
      case "story": {
        await updateDoc(docRef, {
          story: data,
        });
        return;
      }
    }
  } catch (error) {
    console.log(error);
  }
}
