import { convertToLatLng } from "@/utils/util";
import { Polygon, useNavermaps } from "react-naver-maps";

interface MapOptionProps {
  paths: [{ latitude: number; longitude: number }[]];
}

export default function MapOption({ paths }: MapOptionProps) {
  const navermaps = useNavermaps();

  return (
    <>
      {paths.map((path, index) => (
        <Polygon
          key={index}
          paths={[convertToLatLng(navermaps, path)]}
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
