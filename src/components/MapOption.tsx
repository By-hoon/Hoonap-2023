import { convertToLatLng } from "@/utils/util";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { Listener, Marker, Polygon, useNavermaps } from "react-naver-maps";

type PathType = { latitude: number; longitude: number };

interface MapOptionProps {
  paths: { pathArray: PathType[]; storyId?: string }[];
  clickMap?: (polygonNumber?: number) => void;
  addPaths?: (path: PathType) => void;
  deletePaths?: (index: number) => void;
}

export default function MapOption({ paths, clickMap, addPaths, deletePaths }: MapOptionProps) {
  const [curHoverPolygon, setcurHoverPolygon] = useState<number | undefined>();
  const [curClickPolygon, setCurClickPolygon] = useState<number | undefined>();
  const [keyword, setKeyword] = useState("");

  const navermaps = useNavermaps();

  const router = useRouter();

  const hoverPolygon = (cur: number | undefined) => {
    setcurHoverPolygon(cur);
  };

  const clickPolygon = (cur: number | undefined) => {
    if (!clickMap) return;
    clickMap(cur);
    setCurClickPolygon(cur);
  };

  const onChangeKeyword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  }, []);

  const searchMap = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (keyword === "") return;

    navermaps.Service.geocode({ query: keyword }, (status, res) => {
      if (res.v2.addresses.length === 0) return;

      const resAddress = res.v2.addresses[0];
      const x = Number(resAddress.x);
      const y = Number(resAddress.y);

      console.log(x, y);
    });
  };

  const mapOptionRender = () => {
    switch (router.pathname) {
      case "/create":
      case "/story/edit":
        return (
          <>
            <div className="absolute top-0 left-0">
              <form onSubmit={searchMap}>
                <input
                  className=""
                  type="text"
                  value={keyword}
                  placeholder="검색어를 입력해 주세요."
                  onChange={onChangeKeyword}
                  required
                />
              </form>
            </div>
            <Listener
              type="click"
              listener={(e) =>
                addPaths ? addPaths({ latitude: e.coord.lat(), longitude: e.coord.lng() }) : null
              }
            />
            {paths[0].pathArray.length ? (
              <Polygon
                paths={[convertToLatLng(navermaps, paths[0].pathArray)]}
                fillColor="#ff0000"
                fillOpacity={0.3}
                strokeColor="#ff0000"
                strokeOpacity={0.6}
                strokeWeight={2}
              />
            ) : null}
            {paths[0].pathArray.map((path, index) => (
              <Marker
                key={index}
                position={new navermaps.LatLng(path.latitude, path.longitude)}
                onClick={() => (deletePaths ? deletePaths(index) : null)}
              />
            ))}
          </>
        );
      case "/user/detail":
        return (
          <>
            <Listener type="click" listener={() => clickPolygon(undefined)} />
            {paths.map((path, index) => (
              <Polygon
                key={index}
                paths={[convertToLatLng(navermaps, path.pathArray)]}
                fillColor={index === curHoverPolygon || index === curClickPolygon ? "#0086cc" : "#ff0000"}
                fillOpacity={0.3}
                strokeColor={index === curHoverPolygon || index === curClickPolygon ? "#0086cc" : "#ff0000"}
                strokeOpacity={0.6}
                strokeWeight={2}
                clickable
                onClick={() => clickPolygon(index)}
                onMouseover={() => hoverPolygon(index)}
                onMouseout={() => hoverPolygon(undefined)}
              />
            ))}
          </>
        );

      default:
        return (
          <>
            {paths.map((path, index) => (
              <Polygon
                key={index}
                paths={[convertToLatLng(navermaps, path.pathArray)]}
                fillColor="#ff0000"
                fillOpacity={0.3}
                strokeColor="#ff0000"
                strokeOpacity={0.6}
                strokeWeight={2}
              />
            ))}
          </>
        );
    }
  };

  return <>{mapOptionRender()}</>;
}
