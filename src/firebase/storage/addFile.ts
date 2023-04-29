import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const storage = getStorage();

export default async function addFile(file: Blob, name: string) {
  const storageRef = ref(storage, name);

  try {
    return await uploadBytes(storageRef, file).then(
      async () => await getDownloadURL(ref(storage, name)).then((url) => url)
    );
  } catch (error) {
    console.log(error);
    return false;
  }
}
