import getDocument from "@/firebase/firestore/getDocument";
import { useEffect, useState } from "react";

const useUser = (userId: string | undefined) => {
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    if (!userId) return;

    const getUserData = async () => {
      const result = await getDocument("users", userId);
      if (!result) {
        setNickname("unknown");
        return;
      }
      setNickname(result.nickname);
    };

    getUserData();
  }, [userId]);

  return { nickname, setNickname };
};

export default useUser;
