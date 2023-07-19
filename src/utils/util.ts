export const convertToLatLng = (
  navermaps: typeof naver.maps,
  target: { latitude: number; longitude: number }[]
) => {
  return target.map((path) => new navermaps.LatLng(path.latitude, path.longitude));
};
