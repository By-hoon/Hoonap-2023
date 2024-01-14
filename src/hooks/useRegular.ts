import getDocument from "@/firebase/firestore/getDocument";
import { useEffect, useState } from "react";

const useRegular = (userId: string | undefined) => {
  const [regular, setRegular] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (!userId) return;

    const getRegularData = async () => {
      const result = await getDocument("regulars", userId);
      if (!result) return;

      const newRegulars: { [key: string]: boolean } = {};
      Object.keys(result).forEach((key) => {
        newRegulars[key] = true;
      });
      setRegular(newRegulars);
    };

    getRegularData();
  }, [userId]);

  return { regular, setRegular };
};

export default useRegular;
