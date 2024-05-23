import Layout from "@/components/common/Layout";
import getDocument from "@/firebase/firestore/getDocument";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Log = () => {
  const [likes, setLikes] = useState<{ imageId: string; imageUrl: string }[]>([]);

  const router = useRouter();

  const { userId } = router.query;

  useEffect(() => {
    if (!userId) return;

    const getUserLikes = async () => {
      const likesResult = await getDocument("likes", userId as string);
      if (!likesResult || likesResult.empty) return;
    };

    getUserLikes();
  }, [userId]);

  return <Layout>Log</Layout>;
};

export default Log;
