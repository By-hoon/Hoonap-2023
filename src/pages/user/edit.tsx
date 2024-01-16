import Layout from "@/components/common/Layout";
import withHead from "@/components/hoc/withHead";
import { PopUpContext } from "@/context/popUpProvider";
import { alertContent, alertTitle, headDescription, headTitle } from "@/shared/constants";
import Router, { useRouter } from "next/router";
import { useContext, useEffect } from "react";

const UserEdit = () => {
  const router = useRouter();
  const { userId } = router.query;

  const { alert } = useContext(PopUpContext);

  useEffect(() => {
    if (!userId) {
      alert(alertTitle.access, alertContent.noUser);
      Router.push("/");
      return;
    }
  }, [alert, userId]);

  return (
    <Layout>
      <div></div>
    </Layout>
  );
};

export default withHead(UserEdit, headTitle.userEdit, headDescription.userEdit);
