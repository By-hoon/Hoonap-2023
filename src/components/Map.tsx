import { Container as MapDiv, NaverMap, useNavermaps } from "react-naver-maps";
import useMyLocation from "@/hooks/useMyLocation";

export default function Map({ children }: { children: React.ReactNode }) {
  const { myLocation } = useMyLocation();
  const navermaps = useNavermaps();

  return (
    <MapDiv id="map" className="w-[400px] h-[400px]">
      {typeof myLocation !== "string" ? (
        <NaverMap
          defaultCenter={new navermaps.LatLng(myLocation.latitude, myLocation.longitude)}
          defaultZoom={15}
        >
          {children}
        </NaverMap>
      ) : null}
    </MapDiv>
  );
}
