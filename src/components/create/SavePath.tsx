import useMap from "@/hooks/useMap";
import { Dispatch, SetStateAction } from "react";

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
  useMap();

  return <div id="map" className="w-[400px] h-[400px]"></div>;
};

export default SavePath;
