import Title from "@/components/common/Title";
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

  const trySignUp = async () => {
    const userData = await signUp(email, password);
    if (!userData) return;
    const userId = userData.user.uid;
    const addResult = await setData("users", userId, { nickname: nickname });
    if (!addResult) return;
    router.push("/");
  };

  return (
    <div>
      <Title title="회원가입" />
      <div>
        <input
          type="text"
          value={email}
          placeholder="아이디를 입력해 주세요"
          onChange={changeEmail}
          required
        />
      </div>
      <div>
        <input
          type="password"
          value={password}
          placeholder="비밀번호를 입력해 주세요"
          onChange={changePassword}
          required
        />
      </div>
      <div>
        <input
          type="text"
          value={nickname}
          placeholder="닉네임을 입력해 주세요"
          onChange={changeNickname}
          required
        />
      </div>
      <button onClick={trySignUp}>가입</button>
    </div>
  );
};

export default Signup;
