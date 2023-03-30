import useMap from "@/hooks/useMap";
import { Dispatch, SetStateAction, useEffect } from "react";

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
  const { targetPath } = useMap();

  useEffect(() => {
    if (targetPath) {
      setPath(path.concat(targetPath));
    }
  }, [targetPath]);

  return <div id="map" className="w-[400px] h-[400px]"></div>;
};

export default SavePath;
