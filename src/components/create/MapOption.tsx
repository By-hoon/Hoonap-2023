import { convertToLatLng } from "@/utils/util";
import { Dispatch, SetStateAction } from "react";
import { Listener, Marker, Polygon, useNavermaps } from "react-naver-maps";

interface MapOptionProps {
  paths: { latitude: number; longitude: number }[];
  setPaths: Dispatch<SetStateAction<{ latitude: number; longitude: number }[]>>;
}

export default function MapOption({ paths, setPaths }: MapOptionProps) {
  const navermaps = useNavermaps();

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
    <>
      <Listener
        type="click"
        listener={(e) => addPaths({ latitude: e.coord.lat(), longitude: e.coord.lng() })}
      />
      <Polygon
        paths={[convertToLatLng(navermaps, paths)]}
        fillColor="#ff0000"
        fillOpacity={0.3}
        strokeColor="#ff0000"
        strokeOpacity={0.6}
        strokeWeight={3}
      />
      {paths.map((path, index) => (
        <Marker
          key={index}
          position={new navermaps.LatLng(path.latitude, path.longitude)}
          onClick={() => deletePaths(index)}
        />
      ))}
    </>
  );
}
