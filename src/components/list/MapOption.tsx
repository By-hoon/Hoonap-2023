import { convertToLatLng } from "@/utils/util";
import { Dispatch, SetStateAction } from "react";
import { Listener, Polygon } from "react-naver-maps";

interface MapOptionProps {
  pathObjects: { pathArray: { latitude: number; longitude: number }[]; storyId: string }[];
  setCurrentStoryId: Dispatch<SetStateAction<string | undefined>>;
}

export default function MapOption({ pathObjects, setCurrentStoryId }: MapOptionProps) {
  return (
    <>
      <Listener type="click" listener={() => setCurrentStoryId(undefined)} />
      {pathObjects.map((pathObject, index) => (
        <Polygon
          key={index}
          paths={[convertToLatLng(pathObject.pathArray)]}
          fillColor="#ff0000"
          fillOpacity={0.3}
          strokeColor="#ff0000"
          strokeOpacity={0.6}
          strokeWeight={3}
          clickable
          onClick={() => setCurrentStoryId(pathObject.storyId)}
        />
      ))}
    </>
  );
}
