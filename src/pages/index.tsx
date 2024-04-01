import Layout from "@/components/common/Layout";
import { isExp } from "@/utils/util";
import { ADD_INFO, EXP_INFO, HEAD_TITLE, HEAD_DESCRIPTION } from "@/shared/constants";
import { useAuth } from "@/context/authProvider";
import withHead from "@/components/hoc/withHead";

const Home = () => {
  const { user } = useAuth();

  if (user === undefined || !user) return <></>;

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
