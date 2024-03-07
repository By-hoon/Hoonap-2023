import Layout from "@/components/common/Layout";
import signIn from "@/firebase/auth/signIn";
import { useRouter } from "next/router";
import { isExp } from "@/utils/util";
import { ADD_INFO, EXP_INFO, HEAD_TITLE, HEAD_DESCRIPTION } from "@/shared/constants";
import { useAuth } from "@/context/authProvider";
import Button from "@/components/common/Button";
import withHead from "@/components/hoc/withHead";

const Home = () => {
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

  if (!user)
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

  if (isExp(user.uid))
    return (
      <Layout>
        <div className="w-[300px] p-[10px] mx-[auto]">
          <div className="text-[22px] font-semibold text-center my-[20px]">{ADD_INFO.EXP_SUBTITLE}</div>
          <div>
            {EXP_INFO.map((info, index) => (
              <div key={index} className="text-[17px] mt-[10px] break-keep">
                {info}
              </div>
            ))}
            <div className="flex flex-wrap">
              {ADD_INFO.EXP_RESTRICTS.map((restrict, index) => (
                <div
                  key={index}
                  className="text-[15px] text-white mx-[2px] mt-[2px] px-[10px] py-[4px] bg-red-300"
                >
                  {restrict}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );

  return <Layout>Home</Layout>;
};

export default withHead(Home, HEAD_TITLE.MAIN, HEAD_DESCRIPTION.MAIN);
