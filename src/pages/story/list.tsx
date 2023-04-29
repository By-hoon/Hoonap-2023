import getData from "@/firebase/firestore/getData";
import { DocumentData } from "firebase/firestore";

const List = (stories: DocumentData[]) => {
  console.log(stories);
  return <div></div>;
};

export default List;

export const getServerSideProps = async () => {
  const result = await getData("stories");
  const stories: DocumentData[] = [];

  if (result)
    result.forEach((e) => {
      stories.push(e.data());
    });

  return {
    props: {
      stories,
    },
  };
};
