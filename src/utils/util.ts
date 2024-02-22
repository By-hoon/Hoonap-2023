import { maxNicknameLength } from "@/shared/constants";

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

export const checkNickname = (nickname: string) => {
  const engReg = new RegExp(/[a-zA-Z]/g);
  const korReg = new RegExp(/[가-힣]/g);
  const korSubReg = new RegExp(/[ㄱ-ㅎ]/g);
  const numReg = new RegExp(/[0-9]/g);

  const engMatch = nickname.match(engReg) || [];
  const korMatch = nickname.match(korReg) || [];
  const korSubMatch = nickname.match(korSubReg) || [];
  const numMatch = nickname.match(numReg) || [];

  const totalLength = engMatch.length + korMatch.length * 2 + korSubMatch.length + numMatch.length;

  if (totalLength > maxNicknameLength) return "nicknameLength";

  const nicknameValid = new RegExp(/^[가-힣0-9a-zA-Z]+$/);

  if (!nicknameValid.test(nickname)) return "nicknameValid";

  return true;
};
