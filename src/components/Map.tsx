import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Listener, Container as MapDiv, NaverMap, Polygon, useNavermaps } from "react-naver-maps";

interface MapProps {
  paths: {
    latitude: number;
    longitude: number;
  }[];
  setTargetPath: Dispatch<SetStateAction<{ latitude: number; longitude: number } | undefined>>;
}

export default function Map({ paths, setTargetPath }: MapProps) {
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
        >
          <Listener
            type="click"
            listener={(e) => setTargetPath({ latitude: e.coord.lat(), longitude: e.coord.lng() })}
          />
          <Polygon
            paths={[paths.map((path) => new navermaps.LatLng(path.latitude, path.longitude))]}
            fillColor="#ff0000"
            fillOpacity={0.3}
            strokeColor="#ff0000"
            strokeOpacity={0.6}
            strokeWeight={3}
          />
        </NaverMap>
      ) : null}
    </MapDiv>
  );
}
