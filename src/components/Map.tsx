import { Container as MapDiv, NaverMap, useNavermaps } from "react-naver-maps";
import useMyLocation from "@/hooks/useMyLocation";

interface MapProps {
  children: React.ReactNode;
  location?: { latitude: number; longitude: number };
}

export default function Map({ children, location }: MapProps) {
  const { myLocation } = useMyLocation();
  const navermaps = useNavermaps();

  return (
    <MapDiv id="map" className="w-[100%] h-[100%]">
      {typeof myLocation !== "string" ? (
        <NaverMap
          defaultCenter={
            location
              ? new navermaps.LatLng(location.latitude, location.longitude)
              : new navermaps.LatLng(myLocation.latitude, myLocation.longitude)
          }
          defaultZoom={15}
        >
          {children}
        </NaverMap>
      ) : null}
    </MapDiv>
  );
}
