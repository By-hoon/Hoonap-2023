import { Container as MapDiv, NaverMap, useNavermaps } from "react-naver-maps";
import useMyLocation from "@/hooks/useMyLocation";
import { useCallback, useContext, useEffect, useState } from "react";
import { PopUpContext } from "@/context/popUpProvider";
import { ALERT_CONTENT, ALERT_TITLE } from "@/shared/constants";
import { Icon } from "@iconify/react";

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
  const [addresses, setAddresses] = useState<{ roadAddress: string; x: string; y: string }[]>([]);

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

      const newAddresses: { roadAddress: string; x: string; y: string }[] = [];
      res.v2.addresses.forEach((address) => {
        newAddresses.push({ roadAddress: address.roadAddress, x: address.x, y: address.y });
      });

      setAddresses(newAddresses);
    });
  };

  const moveCenter = (x: string, y: string) => {
    setCenter({ latitude: Number(y), longitude: Number(x) });

    setAddresses([]);
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
  }, [location, myLocation]);

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
          {addresses.length !== 0 ? (
            <div className="absolute top-[55px] left-[5px] md:w-[50%] mobile:w-[80%]">
              <div className="h-[200px] bg-white rounded-[10px] overflow-y-scroll scrollbar-hide">
                {addresses.map((address) => (
                  <div
                    key={address.roadAddress}
                    className="cursor-pointer w-full text-[17px] mobile:text-[15px] border-b p-[6px] mobile:p-[5px] break-keep"
                    onClick={() => moveCenter(address.x, address.y)}
                  >
                    {address.roadAddress}
                  </div>
                ))}
              </div>
              <div className="flex-middle mt-[6px]">
                <Icon
                  icon="fluent-mdl2:cancel"
                  className="cursor-pointer text-[24px]"
                  onClick={() => {
                    setAddresses([]);
                  }}
                />
              </div>
            </div>
          ) : null}
        </NaverMap>
      ) : null}
    </MapDiv>
  );
}
