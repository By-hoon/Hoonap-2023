import { PopUpContext } from "@/context/popUpProvider";
import { ALERT_CONTENT, ALERT_TITLE, NICKNAME_INFO } from "@/shared/constants";
import { checkNickname } from "@/utils/util";
import { Dispatch, SetStateAction, useContext, useState } from "react";

interface NicknameFormProps {
  nickname: string;
  setNickname: Dispatch<SetStateAction<string>>;
  isPassNickname: boolean;
  setIsPassNickname: Dispatch<SetStateAction<boolean>>;
}

const NicknameForm = ({ nickname, setNickname, isPassNickname, setIsPassNickname }: NicknameFormProps) => {
  const { alert } = useContext(PopUpContext);

  const changeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target.value;

    const checkResult = checkNickname(target);

    switch (checkResult[0]) {
      case "nicknameLength": {
        alert(ALERT_TITLE.NICKNAME, ALERT_CONTENT.NICKNAME_LENGTH);
        return;
      }

      case "nicknameValid": {
        setIsPassNickname(false);
        setNickname(target);
        return;
      }

      case "filtering": {
        setIsPassNickname(false);
        setNickname(target);
        alert(ALERT_TITLE.NICKNAME, `${ALERT_CONTENT.NICKNAME_FILTER} '${checkResult[1]}'`);
        return;
      }

      default: {
        setIsPassNickname(true);
        setNickname(target);
      }
    }
  };

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
