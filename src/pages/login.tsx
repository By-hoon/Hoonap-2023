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

  const tryLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await signIn(email, password);
    if (!result) return;
    router.push("/");
  };

  const tryLoginTestAccount = async () => {
    const result = await signIn(
      `${process.env.NEXT_PUBLIC_EXPERIENCE_AUTH_ID}`,
      `${process.env.NEXT_PUBLIC_EXPERIENCE_AUTH_PASSWORD}`
    );
    if (!result) return;
    router.push("/");
  };

  const goSignUp = () => {
    router.push("/signup");
  };

  return (
    <div className="max-w-[425px] min-w-[320px] mx-auto p-[5px]">
      <div className="text-[24px] text-bc px-[10px] py-[7px] mb-[40px] border-b border-bs">로그인</div>
      <form onSubmit={tryLogin}>
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
        <div className="text-center mb-[20px]">
          <div>
            <input className="submit-button" type="submit" value="로그인" />
            <button
              className="submit-button bg-gray-400 hover:bg-gray-500 mx-[7px]"
              onClick={tryLoginTestAccount}
            >
              체험하기
            </button>
          </div>
          <div className="text-[17px] mt-[10px] hover:text-bcd">
            <button onClick={goSignUp}>아직 회원이 아니신가요? →</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
