import dynamic from "next/dynamic";
import { Dispatch, SetStateAction } from "react";
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

interface SavePathProps {
  path: {
    latitude: number;
    longitude: number;
  }[];
  setPath: Dispatch<
    SetStateAction<
      {
        latitude: number;
        longitude: number;
      }[]
    >
  >;
}

const SavePath = ({ path, setPath }: SavePathProps) => {
  return (
    <div>
      <Map />
    </div>
  );
};

export default SavePath;
