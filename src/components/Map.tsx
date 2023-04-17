import { useEffect, useState } from "react";
import { Container as MapDiv, NaverMap, useNavermaps } from "react-naver-maps";

export default function Map() {
  const [myLocation, setMyLocation] = useState<{ latitude: number; longitude: number } | string>("");

  const navermaps = useNavermaps();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setMyLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
      return;
    }
    window.alert("현재 위치를 알 수 없습니다. 기본 위치로 지정합니다.");
    setMyLocation({
      latitude: 37.4862618,
      longitude: 127.1222903,
    });
  }, []);

  return (
    <MapDiv id="map" className="w-[400px] h-[400px]">
      {typeof myLocation !== "string" ? (
        <NaverMap
          defaultCenter={new navermaps.LatLng(myLocation.latitude, myLocation.longitude)}
          defaultZoom={15}
        ></NaverMap>
      ) : null}
    </MapDiv>
  );
}
