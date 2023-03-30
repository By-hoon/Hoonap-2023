import { useEffect, useRef, useState } from "react";

function useMap() {
  const [myLocation, setMyLocation] = useState<{ latitude: number; longitude: number } | string>("");
  const [targetPath, setTargetPath] = useState<{ latitude: number; longitude: number }>();

  const mapRef = useRef<HTMLElement | null | any>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setMyLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    } else {
      window.alert("현재 위치를 알 수 없습니다. 기본 위치로 지정합니다.");
      setMyLocation({ latitude: 37.4862618, longitude: 127.1222903 });
    }
  }, []);

  useEffect(() => {
    if (typeof myLocation !== "string") {
      let currentPosition = [myLocation.latitude, myLocation.longitude];

      mapRef.current = new naver.maps.Map("map", {
        center: new naver.maps.LatLng(currentPosition[0], currentPosition[1]),
        zoomControl: true,
      });

      naver.maps.Event.addListener(mapRef.current, "click", function (e) {
        setTargetPath({ latitude: e.coord.lat(), longitude: e.coord.lng() });
      });
    }
  }, [myLocation]);

  return {
    myLocation,
    targetPath,
  };
}

export default useMap;
