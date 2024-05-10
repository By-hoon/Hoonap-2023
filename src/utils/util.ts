export const convertToLatLng = (
  navermaps: typeof naver.maps,
  target: { latitude: number; longitude: number }[]
) => {
  return target.map((path) => new navermaps.LatLng(path.latitude, path.longitude));
};

export const isExp = (uid: string) => {
  return uid === process.env.NEXT_PUBLIC_EXPERIENCE_AUTH_UID;
};

export const getElapsedTime = (time: number) => {
  const diff = (Date.now() - time) / 1000;

  const times = [
    { name: "년", milliSeconds: 60 * 60 * 24 * 365 },
    { name: "개월", milliSeconds: 60 * 60 * 24 * 30 },
    { name: "일", milliSeconds: 60 * 60 * 24 },
    { name: "시간", milliSeconds: 60 * 60 },
    { name: "분", milliSeconds: 60 },
  ];

  for (const value of times) {
    const betweenTime = Math.floor(diff / value.milliSeconds);

    if (betweenTime > 0) {
      return `${betweenTime}${value.name} 전`;
    }
  }
  return "방금 전";
};

const cardColumn = (curWidth: number) => {
  if (curWidth > 1000) return 6;
  if (curWidth <= 1000 && curWidth > 768) return 5;
  if (curWidth <= 768 && curWidth > 568) return 4;
  if (curWidth <= 568 && curWidth > 368) return 3;
  return 2;
};

export const cardSizeCalculator = (curWidth: number) => {
  return Math.floor(curWidth / cardColumn(curWidth)) - 10;
};
