import { GetServerSidePropsContext } from "next/types";
import dynamic from "next/dynamic";
import checkUser from "@/firebase/auth/checkUser";
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

const List = () => {
  return <div>{/* <Map paths={} /> */}</div>;
};

export default List;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const uid = await checkUser(context);
  if (!uid)
    return {
      props: {} as never,
    };
  return {
    props: { uid },
  };
};
