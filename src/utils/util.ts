import { useNavermaps } from "react-naver-maps";

export const convertToLatLng = (target: { latitude: number; longitude: number }[]) => {
  const navermaps = useNavermaps();
  return target.map((path) => new navermaps.LatLng(path.latitude, path.longitude));
};
