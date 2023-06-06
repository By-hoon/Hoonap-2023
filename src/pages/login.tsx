import Title from "@/components/common/Title";
import signIn from "@/firebase/auth/signIn";
import { useRouter } from "next/router";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const changeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const changePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const tryLogin = async () => {
    const result = await signIn(email, password);
    if (!result) return;
    router.push("/");
  };

  const goSignUp = () => {
    router.push("/signup");
  };

  return (
    <div>
      <Title title="로그인" />
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
        <button onClick={tryLogin}>로그인</button>
      </div>
      <div>
        <button onClick={goSignUp}>회원가입</button>
      </div>
    </div>
  );
};

export default Login;
