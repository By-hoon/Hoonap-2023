import { PopUpContext } from "@/context/popUpProvider";
import getCollection from "@/firebase/firestore/getCollection";
import {
  ALERT_CONTENT,
  ALERT_TITLE,
  MAX_NICKNAME_LENGTH,
  NICKNAME_FILTERS,
  NICKNAME_INFO,
} from "@/shared/constants";
import { Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from "react";

interface NicknameFormProps {
  nickname: string;
  setNickname: Dispatch<SetStateAction<string>>;
  isPassNickname: boolean;
  setIsPassNickname: Dispatch<SetStateAction<boolean>>;
}

const NicknameForm = ({ nickname, setNickname, isPassNickname, setIsPassNickname }: NicknameFormProps) => {
  const [otherNicknames, setOtherNicknames] = useState<string[]>([]);

  const { alert } = useContext(PopUpContext);

  const checkNicknameLength = useCallback((target: string) => {
    const engReg = new RegExp(/[a-zA-Z]/g);
    const korReg = new RegExp(/[가-힣]/g);
    const korSubReg = new RegExp(/[ㄱ-ㅎ]/g);
    const numReg = new RegExp(/[0-9]/g);

    const engMatch = target.match(engReg) || [];
    const korMatch = target.match(korReg) || [];
    const korSubMatch = target.match(korSubReg) || [];
    const numMatch = target.match(numReg) || [];

    const totalLength = engMatch.length + korMatch.length * 2 + korSubMatch.length + numMatch.length;

    if (totalLength > MAX_NICKNAME_LENGTH) return false;

    return true;
  }, []);

  const checkNicknameValid = useCallback((target: string) => {
    const nicknameValid = new RegExp(/^[가-힣0-9a-zA-Z]+$/);

    if (!nicknameValid.test(target)) return false;

    return true;
  }, []);

  const filteringNickname = useCallback((target: string) => {
    let error = "";

    for (var i = 0; i < NICKNAME_FILTERS.length; i++) {
      for (var j = 0; j < target.length; j++) {
        const curString = target.substring(j, j + NICKNAME_FILTERS[i].length);
        if (NICKNAME_FILTERS[i] == curString.toLowerCase()) {
          error = curString;
          break;
        }
      }
    }

    return error === "" ? true : error;
  }, []);

  const duplicateNickname = useCallback(
    (target: string) => {
      let isDuplicate = false;

      otherNicknames.forEach((otherNickname) => {
        if (target === otherNickname) {
          isDuplicate = true;
          return;
        }
      });

      return isDuplicate;
    },
    [otherNicknames]
  );

  const changeNickname = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const target = e.target.value;

      const filteringResult = filteringNickname(target);

      if (typeof filteringResult === "string") {
        setIsPassNickname(false);
        setNickname(target);
        alert(ALERT_TITLE.NICKNAME, `${ALERT_CONTENT.NICKNAME_FILTER} '${filteringResult}'`);
        return;
      }

      if (!checkNicknameLength(target)) {
        alert(ALERT_TITLE.NICKNAME, ALERT_CONTENT.NICKNAME_LENGTH);
        return;
      }

      if (!checkNicknameValid(target)) {
        setIsPassNickname(false);
        setNickname(target);
        return;
      }

      if (duplicateNickname(target)) {
        alert(ALERT_TITLE.NICKNAME, ALERT_CONTENT.NICKNAME_DUPLICATE);
        setIsPassNickname(false);
        setNickname(target);
        return;
      }

      setIsPassNickname(true);
      setNickname(target);
    },
    [
      alert,
      checkNicknameLength,
      checkNicknameValid,
      duplicateNickname,
      filteringNickname,
      setIsPassNickname,
      setNickname,
    ]
  );

  useEffect(() => {
    const getOtherNicknames = async () => {
      const result = await getCollection("users");
      if (!result || result.empty) return;

      setOtherNicknames(result.docs.map((doc) => doc.data().nickname));
    };

    getOtherNicknames();
  }, []);

  return (
    <div>
      <input
        className={`input-templete ${
          isPassNickname
            ? "focus:border-bc focus:bg-bcvl"
            : "border-red-400 focus:border-red-400 focus:bg-red-50"
        }`}
        type="text"
        value={nickname}
        placeholder="닉네임을 입력해 주세요"
        onChange={changeNickname}
        required
      />
      <div className="text-[12px] text-zinc-400">{NICKNAME_INFO}</div>
    </div>
  );
};

export default NicknameForm;
