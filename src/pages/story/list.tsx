import getData from "@/firebase/firestore/getData";
import { DocumentData } from "firebase/firestore";

const List = (stories: DocumentData[]) => {
  console.log(stories);
  return <div></div>;
};

export default List;

export const getServerSideProps = async () => {
  const { result, error } = await getData("stories");
  const stories: DocumentData[] = [];

  result?.forEach((e) => {
    stories.push(e.data());
  });

  return {
    props: {
      stories,
    },
  };
};
