import Title from "@/components/common/Title";
import signUp from "@/firebase/auth/signUp";
import { useRouter } from "next/router";
import { useState } from "react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const changeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const changePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const trySignUp = async () => {
    const result = await signUp(email, password);
    if (!result) return;
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
      <button onClick={trySignUp}>가입</button>
    </div>
  );
};

export default Signup;
