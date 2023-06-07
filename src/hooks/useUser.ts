import getDocument from "@/firebase/firestore/getDocument";
import { useEffect, useState } from "react";

const useUser = (userId: string) => {
  const [nickname, setNickname] = useState("");

  const getUserData = async () => {
    const result = await getDocument("users", userId);
    if (!result) {
      setNickname("unknown");
      return;
    }
    setNickname(result.nickname);
  };

  useEffect(() => {
    getUserData();
  }, []);

  return { nickname };
};

export default useUser;
