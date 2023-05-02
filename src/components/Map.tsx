import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Listener, Container as MapDiv, Marker, NaverMap, Polygon, useNavermaps } from "react-naver-maps";

interface MapProps {
  paths: {
    latitude: number;
    longitude: number;
  }[];
  setPaths?: Dispatch<
    SetStateAction<
      {
        latitude: number;
        longitude: number;
      }[]
    >
  >;
}

export default function Map({ paths, setPaths }: MapProps) {
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
  const mapChildRender = () => {
    switch (setPaths) {
      case undefined: {
        const polygons: { latitude: number; longitude: number }[][] = [];
        let polyPaths: { latitude: number; longitude: number }[] = [];
        paths.forEach((path) => {
          if (path.latitude === 0) {
            polygons.push([...polyPaths]);
            polyPaths = [];
            return;
          }
          polyPaths.push(path);
        });
        return (
          <>
            {polygons.map((polygon, index) => (
              <Polygon
                key={index}
                paths={[polygon.map((path) => new navermaps.LatLng(path.latitude, path.longitude))]}
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
      default: {
        const addPaths = (path: { latitude: number; longitude: number }) => {
          const newPaths = [...paths];
          newPaths.push(path);
          setPaths(newPaths);
        };

        const deletePaths = (index: number) => {
          const newPaths = [...paths];
          newPaths.splice(index, 1);
          setPaths(newPaths);
        };
        return (
          <>
            <Listener
              type="click"
              listener={(e) => addPaths({ latitude: e.coord.lat(), longitude: e.coord.lng() })}
            />
            <Polygon
              paths={[paths.map((path) => new navermaps.LatLng(path.latitude, path.longitude))]}
              fillColor="#ff0000"
              fillOpacity={0.3}
              strokeColor="#ff0000"
              strokeOpacity={0.6}
              strokeWeight={3}
            />
            {paths.map((path, index) => (
              <Marker
                key={index}
                position={new navermaps.LatLng(path.latitude, path.longitude)}
                onClick={() => deletePaths(index)}
              />
            ))}
          </>
        );
      }
    }
  };

  return (
    <MapDiv id="map" className="w-[400px] h-[400px]">
      {typeof myLocation !== "string" ? (
        <NaverMap
          defaultCenter={new navermaps.LatLng(myLocation.latitude, myLocation.longitude)}
          defaultZoom={15}
        >
          {mapChildRender()}
        </NaverMap>
      ) : null}
    </MapDiv>
  );
}
