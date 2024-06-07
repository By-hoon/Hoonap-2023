import Button from "@/components/common/Button";
import withHead from "@/components/hoc/withHead";
import NicknameForm from "@/components/user/NicknameForm";
import { PopUpContext } from "@/context/popUpProvider";
import signUp from "@/firebase/auth/signUp";
import setData from "@/firebase/firestore/setData";
import Alerts from "@/shared/alerts";
import { ALERT_TITLE, ALERT_CONTENT, HEAD_DESCRIPTION, HEAD_TITLE, NICKNAME_INFO } from "@/shared/constants";
import { useRouter } from "next/router";
import { useCallback, useContext, useState } from "react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [isPassNickname, setIsPassNickname] = useState(true);

  const router = useRouter();

  const { alert } = useContext(PopUpContext);

  const changeEmail = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const changePassword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const trySignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isPassNickname) {
      alert(ALERT_TITLE.NICKNAME, ALERT_CONTENT.INVALID_NICKNAME);
      return;
    }

    const userData = await signUp(email, password);
    if (typeof userData === "string") {
      const errorCode = userData;
      const { ALERT_TITLE, ALERT_CONTENT } = Alerts(errorCode);
      await alert(ALERT_TITLE, ALERT_CONTENT);
      return;
    }

    const userId = userData.user.uid;
    const usersResult = await setData("users", userId, { nickname: nickname, profileImage: "" });
    const regularsResult = await setData("regulars", userId, {});
    const regularOwnerResult = await setData("regular-owner", userId, {});
    if (!usersResult) return;
    if (!regularsResult) return;
    if (!regularOwnerResult) return;
    router.push("/");
  };

  const goSignIn = () => {
    router.push("/login");
  };

  return (
    <div className="max-w-[425px] min-w-[320px] mx-auto p-[5px]">
      <div className="text-[24px] text-bc px-[10px] py-[7px] mb-[40px] border-b border-bs">회원가입</div>
      <form onSubmit={trySignUp}>
        <div className="mb-[20px] px-[10px]">
          <div className="text-[20px]">아이디</div>
          <input
            className="input-templete"
            type="text"
            value={email}
            placeholder="아이디를 입력해 주세요"
            onChange={changeEmail}
            required
          />
        </div>
        <div className="mb-[20px] px-[10px]">
          <div className="text-[20px]">비밀번호</div>
          <input
            className="input-templete"
            type="password"
            value={password}
            placeholder="비밀번호를 입력해 주세요"
            onChange={changePassword}
            autoComplete="off"
            required
          />
        </div>
        <div className="mb-[20px] px-[10px]">
          <div className="text-[20px]">닉네임</div>
          <NicknameForm
            nickname={nickname}
            setNickname={setNickname}
            isPassNickname={isPassNickname}
            setIsPassNickname={setIsPassNickname}
          />
        </div>
        <div className="text-center">
          <Button text="가입" style="submit-button py-[7px]" type="submit" />
        </div>
      </form>
      <div className="text-center mb-[20px]">
        <div className="text-[17px] mt-[10px] hover:text-bcd">
          <Button text="이미 회원이신가요? →" style="" onClick={goSignIn} />
        </div>
      </div>
    </div>
  );
};

export default withHead(Signup, HEAD_TITLE.SIGNUP, HEAD_DESCRIPTION.SIGNUP);
