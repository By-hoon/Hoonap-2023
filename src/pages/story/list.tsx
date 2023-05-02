import getData from "@/firebase/firestore/getData";
import { DocumentData } from "firebase/firestore";
import dynamic from "next/dynamic";
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

interface ListProps {
  stories: DocumentData[];
}

const List = ({ stories }: ListProps) => {
  const editPaths = () => {
    const polyPaths: {
      latitude: number;
      longitude: number;
    }[] = [];

    stories.forEach((story) => {
      story.paths.forEach((path: { latitude: number; longitude: number }) => {
        polyPaths.push(path);
      });
      polyPaths.push({
        latitude: 0,
        longitude: 0,
      });
    });
    return polyPaths;
  };
  editPaths();
  return (
    <div>
      <Map paths={editPaths()} />
    </div>
  );
};

export default List;

export const getServerSideProps = async () => {
  const result = await getData("stories");
  const stories: DocumentData = [];

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
