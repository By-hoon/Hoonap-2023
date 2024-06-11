import { PopUpContext } from "@/context/popUpProvider";
import { ALERT_CONTENT } from "@/shared/constants";
import { useContext, useEffect, useState } from "react";

const useMyLocation = () => {
  const [myLocation, setMyLocation] = useState<{ latitude: number; longitude: number } | string>("");

  const { alert } = useContext(PopUpContext);

  useEffect(() => {
    const success = (position: GeolocationPosition) => {
      setMyLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    };

    const error = () => {
      alert("", ALERT_CONTENT.MY_LOCATION_ERROR);
      setMyLocation({
        latitude: 37.4862618,
        longitude: 127.1222903,
      });
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => success(position), error);
    }
  }, []);

  return { myLocation };
};

export default useMyLocation;
