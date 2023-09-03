import dynamic from "next/dynamic";
import { Dispatch, SetStateAction } from "react";
import MapOption from "./MapOption";
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

interface SavePathProps {
  paths: { latitude: number; longitude: number }[];
  setPaths: Dispatch<SetStateAction<{ latitude: number; longitude: number }[]>>;
}

const SavePath = ({ paths, setPaths }: SavePathProps) => {
  return (
    <div className="main-absolute">
      <Map>
        <MapOption paths={paths} setPaths={setPaths} />
      </Map>
    </div>
  );
};

export default SavePath;
