import { convertToLatLng } from "@/utils/util";
import { Dispatch, SetStateAction } from "react";
import { Listener, Polygon, useNavermaps } from "react-naver-maps";

interface MapOptionProps {
  paths: { pathArray: { latitude: number; longitude: number }[]; storyId: string }[];
  setCurrentStoryId: Dispatch<SetStateAction<string | undefined>>;
}

export default function MapOption({ paths, setCurrentStoryId }: MapOptionProps) {
  const navermaps = useNavermaps();

  return (
    <>
      <Listener type="click" listener={() => setCurrentStoryId(undefined)} />
      {paths.map((path, index) => (
        <Polygon
          key={index}
          paths={[convertToLatLng(navermaps, path.pathArray)]}
          fillColor="#ff0000"
          fillOpacity={0.3}
          strokeColor="#ff0000"
          strokeOpacity={0.6}
          strokeWeight={3}
          clickable
          onClick={() => setCurrentStoryId(path.storyId)}
        />
      ))}
    </>
  );
}
