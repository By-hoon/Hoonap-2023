import { useEffect, useState } from "react";

const useMyLocation = () => {
  const [myLocation, setMyLocation] = useState<{ latitude: number; longitude: number } | string>("");

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

  return { myLocation };
};

export default useMyLocation;
