import { convertToLatLng } from "@/utils/util";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import { Listener, Marker, Polygon, useNavermaps } from "react-naver-maps";

type PathType = { latitude: number; longitude: number };

interface MapOptionProps {
  paths: { pathArray: PathType[]; storyId?: string }[];
  setCurrentStoryId?: Dispatch<SetStateAction<string | undefined>>;
  addPaths?: (path: PathType) => void;
  deletePaths?: (index: number) => void;
}

export default function MapOption({ paths, setCurrentStoryId, addPaths, deletePaths }: MapOptionProps) {
  const navermaps = useNavermaps();

  const router = useRouter();

  const mapOptionRender = () => {
    switch (router.pathname) {
      case "/create":
        return (
          <>
            <Listener
              type="click"
              listener={(e) =>
                addPaths ? addPaths({ latitude: e.coord.lat(), longitude: e.coord.lng() }) : undefined
              }
            />
            <Polygon
              paths={[convertToLatLng(navermaps, paths[0].pathArray)]}
              fillColor="#ff0000"
              fillOpacity={0.3}
              strokeColor="#ff0000"
              strokeOpacity={0.6}
              strokeWeight={3}
            />
            {paths[0].pathArray.map((path, index) => (
              <Marker
                key={index}
                position={new navermaps.LatLng(path.latitude, path.longitude)}
                onClick={() => (deletePaths ? deletePaths(index) : undefined)}
              />
            ))}
          </>
        );
      default:
        return (
          <>
            <Listener
              type="click"
              listener={() => (setCurrentStoryId ? setCurrentStoryId(undefined) : undefined)}
            />
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
                onClick={() => (setCurrentStoryId ? setCurrentStoryId(path.storyId) : undefined)}
              />
            ))}
          </>
        );
    }
  };

  return <>{mapOptionRender()}</>;
}
