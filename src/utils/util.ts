export const convertToLatLng = (
  navermaps: typeof naver.maps,
  target: { latitude: number; longitude: number }[]
) => {
  return target.map((path) => new navermaps.LatLng(path.latitude, path.longitude));
};

export const isExp = (uid: string) => {
  return uid === process.env.NEXT_PUBLIC_EXPERIENCE_AUTH_UID;
};
