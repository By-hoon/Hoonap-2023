import { Polygon, useNavermaps } from "react-naver-maps";

interface MapOptionProps {
  paths: { latitude: number; longitude: number }[];
}

export default function MapOption({ paths }: MapOptionProps) {
  const navermaps = useNavermaps();

  const convertToPolygons = (
    target: {
      latitude: number;
      longitude: number;
    }[]
  ) => {
    const polygons: { latitude: number; longitude: number }[][] = [];
    let currentPaths: { latitude: number; longitude: number }[] = [];
    target.forEach((path) => {
      if (path.latitude === 0) {
        polygons.push([...currentPaths]);
        currentPaths = [];
        return;
      }
      currentPaths.push(path);
    });
    return polygons;
  };

  const convertToLatLng = (target: { latitude: number; longitude: number }[]) => {
    return target.map((path) => new navermaps.LatLng(path.latitude, path.longitude));
  };

  return (
    <>
      {convertToPolygons(paths).map((polygon, index) => (
        <Polygon
          key={index}
          paths={[convertToLatLng(polygon)]}
          fillColor="#ff0000"
          fillOpacity={0.3}
          strokeColor="#ff0000"
          strokeOpacity={0.6}
          strokeWeight={3}
        />
      ))}
    </>
  );
}
