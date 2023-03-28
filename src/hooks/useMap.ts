import { useEffect, useRef, useState } from "react";

function useMap() {
  const mapRef = useRef<HTMLElement | null | any>(null);

  useEffect(() => {
    let currentPosition = [37.4862618, 127.1222903];

    mapRef.current = new naver.maps.Map("map", {
      center: new naver.maps.LatLng(currentPosition[0], currentPosition[1]),
      zoomControl: true,
    });
  }, []);

  return {};
}

export default useMap;
