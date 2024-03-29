import Button from "@/components/common/Button";
import { useAuth } from "@/context/authProvider";
import signIn from "@/firebase/auth/signIn";
import { useRouter } from "next/router";

const Welcome = () => {
  const { user } = useAuth();

  const router = useRouter();

  const tryLoginTestAccount = async () => {
    const result = await signIn(
      `${process.env.NEXT_PUBLIC_EXPERIENCE_AUTH_ID}`,
      `${process.env.NEXT_PUBLIC_EXPERIENCE_AUTH_PASSWORD}`
    );
    if (!result) return;
    router.replace("/");
  };

  return (
    <div className="max-w-[768px] min-w-[320px] mx-auto p-[5px]">
      <div className="text-center text-[22px] md:text-[24px] font-semibold">Hoonap 방문을 환영합니다 !</div>
      <div className="flex justify-between w-[190px] mx-auto mt-[20px]">
        <Button
          text="회원가입"
          style="submit-button px-[15px]"
          onClick={() => {
            router.push("/signup");
          }}
        />
        <Button
          text="로그인"
          style="submit-button"
          onClick={() => {
            router.push("/login");
          }}
        />
      </div>
      <div className="text-center mt-[40px]">미리 서비스를 사용해 보고 싶다면?</div>
      <div className="mt-[10px] text-center">
        <Button
          text="체험하기"
          style="submit-button bg-gray-400 hover:bg-gray-500"
          onClick={tryLoginTestAccount}
        />
      </div>
    </div>
  );
};

export default Welcome;
