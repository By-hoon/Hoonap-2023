import dynamic from "next/dynamic";
import { Dispatch, SetStateAction } from "react";
import MapOption from "../MapOption";
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

interface SavePathProps {
  paths: { latitude: number; longitude: number }[];
  setPaths: Dispatch<SetStateAction<{ latitude: number; longitude: number }[]>>;
}

const SavePath = ({ paths, setPaths }: SavePathProps) => {
  const addPaths = (path: { latitude: number; longitude: number }) => {
    const newPaths = [...paths];
    newPaths.push(path);
    setPaths(newPaths);
  };

  const deletePaths = (index: number) => {
    const newPaths = [...paths];
    newPaths.splice(index, 1);
    setPaths(newPaths);
  };

  return (
    <div className="main-absolute">
      <Map>
        <MapOption paths={[{ pathArray: paths }]} addPaths={addPaths} deletePaths={deletePaths} />
      </Map>
    </div>
  );
};

export default SavePath;
