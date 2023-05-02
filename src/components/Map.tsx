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

  const convertToLatLng = (
    target: {
      latitude: number;
      longitude: number;
    }[]
  ) => {
    return target.map((path) => new navermaps.LatLng(path.latitude, path.longitude));
  };

  const convertToPolygons = (
    target: {
      latitude: number;
      longitude: number;
    }[]
  ) => {
    const polygons: { latitude: number; longitude: number }[][] = [];
    let currentPaths: { latitude: number; longitude: number }[] = [];
    target.forEach((path) => {
      if (path.latitude === 0) {
        polygons.push([...currentPaths]);
        currentPaths = [];
        return;
      }
      currentPaths.push(path);
    });
    return polygons;
  };

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
        return (
          <>
            {convertToPolygons(paths).map((polygon, index) => (
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
              paths={[convertToLatLng(paths)]}
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
