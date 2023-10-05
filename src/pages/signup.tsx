import Button from "@/components/common/Button";
import signUp from "@/firebase/auth/signUp";
import setData from "@/firebase/firestore/setData";
import { useRouter } from "next/router";
import { useState } from "react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

  const router = useRouter();

  const changeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const changePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const changeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const trySignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userData = await signUp(email, password);
    if (!userData) return;
    const userId = userData.user.uid;
    const addResult = await setData("users", userId, { nickname: nickname });
    if (!addResult) return;
    router.push("/");
  };

  const goSignUp = () => {
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
            required
          />
        </div>
        <div className="mb-[20px] px-[10px]">
          <div className="text-[20px]">닉네임</div>
          <input
            className="input-templete"
            type="text"
            value={nickname}
            placeholder="닉네임을 입력해 주세요"
            onChange={changeNickname}
            required
          />
        </div>
        <div className="text-center">
          <Button text="가입" style="submit-button py-[7px]" type="submit" />
        </div>
      </form>
      <div className="text-center mb-[20px]">
        <div className="text-[17px] mt-[10px] hover:text-bcd">
          <Button text="이미 회원이신가요? →" style="" onClick={goSignUp} />
        </div>
      </div>
    </div>
  );
};

export default Signup;
