import { convertToLatLng } from "@/utils/util";
import { Polygon } from "react-naver-maps";

interface MapOptionProps {
  paths: { latitude: number; longitude: number }[][];
}

export default function MapOption({ paths }: MapOptionProps) {
  return (
    <>
      {paths.map((polygon, index) => (
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
