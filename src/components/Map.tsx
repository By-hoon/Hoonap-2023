import { Container as MapDiv, NaverMap, useNavermaps } from "react-naver-maps";
import useMyLocation from "@/hooks/useMyLocation";
import { useCallback, useContext, useEffect, useState } from "react";
import { PopUpContext } from "@/context/popUpProvider";
import { ALERT_CONTENT, ALERT_TITLE } from "@/shared/constants";

interface MapProps {
  children: React.ReactNode;
  location?: { latitude: number; longitude: number };
  isSearchable?: boolean;
}

export default function Map({ children, location, isSearchable = false }: MapProps) {
  const [center, setCenter] = useState<{ latitude: number; longitude: number }>({
    latitude: 37.5666805,
    longitude: 126.9784147,
  });
  const [keyword, setKeyword] = useState("");
  const [isShowSearch, setIsShowSearch] = useState(true);

  const { myLocation } = useMyLocation();
  const navermaps = useNavermaps();

  const { alert } = useContext(PopUpContext);

  const onChangeKeyword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  }, []);

  const searchMap = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (keyword === "") return;

    navermaps.Service.geocode({ query: keyword }, (status, res) => {
      if (res.v2.addresses.length === 0) {
        alert(ALERT_TITLE.SEARCH, ALERT_CONTENT.INVALID_ADDRESS);
        return;
      }

      const resAddress = res.v2.addresses[0];
      const x = Number(resAddress.x);
      const y = Number(resAddress.y);

      setCenter({ latitude: y, longitude: x });
    });
  };

  useEffect(() => {
    if (location) {
      setCenter({ latitude: location.latitude, longitude: location.longitude });
      return;
    }

    if (typeof myLocation !== "string") {
      setCenter({ latitude: myLocation.latitude, longitude: myLocation.longitude });
      return;
    }
  }, [myLocation]);

  return (
    <MapDiv id="map" className="w-[100%] h-[100%]">
      {typeof myLocation !== "string" ? (
        <NaverMap defaultZoom={15} center={new navermaps.LatLng(center.latitude, center.longitude)}>
          {isSearchable ? (
            <div className="md:w-[50%] mobile:w-[80%] absolute top-0 left-0">
              <form onSubmit={searchMap}>
                <input
                  className="w-full mobile:text-[14px] ml-[5px] mt-[5px] px-[8px] py-[10px] mobile:px-[6px] mobile:py-[8px] rounded-[10px] shadow-basic"
                  type="text"
                  value={keyword}
                  placeholder="검색할 주소를 입력해 주세요."
                  onChange={onChangeKeyword}
                  required
                />
              </form>
            </div>
          ) : null}
          {children}
        </NaverMap>
      ) : null}
    </MapDiv>
  );
}
