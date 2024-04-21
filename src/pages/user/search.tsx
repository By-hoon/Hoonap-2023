import Layout from "@/components/common/Layout";
import withHead from "@/components/hoc/withHead";
import UserCard from "@/components/user/UserCard";
import { useAuth } from "@/context/authProvider";
import { PopUpContext } from "@/context/popUpProvider";
import getCollection from "@/firebase/firestore/getCollection";
import { ALERT_CONTENT, ALERT_TITLE, HEAD_DESCRIPTION, HEAD_TITLE } from "@/shared/constants";
import { isExp } from "@/utils/util";
import { Icon } from "@iconify/react";
import Router from "next/router";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

const Search = () => {
  const [focus, setFocus] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [targets, setTargets] = useState<
    { nickname: string; profileImage: string; userId: string }[] | undefined
  >();

  const { user } = useAuth();

  const { alert } = useContext(PopUpContext);

  const ref = useRef<HTMLInputElement>(null);

  const onClickOutSide = (e: any) => {
    if (focus && ref.current && !ref.current.contains(e.target)) {
      setFocus(false);
    }
  };

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  }, []);

  const getSearchResult = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (keyword === "") {
      alert(ALERT_TITLE.INPUT, ALERT_CONTENT.REQUIRE_VALUE);
      setTargets(undefined);
      return;
    }

    const keywordValid = new RegExp(/^[가-힣0-9a-zA-Z]+$/);

    let filteredKeyword = keyword
      .split("")
      .map((str) => {
        if (keywordValid.test(str)) return str;
      })
      .join("");

    if (!filteredKeyword) {
      setTargets([]);
      return;
    }

    const result = await getCollection("users");
    if (!result || result.empty) return;

    const newTargets: { nickname: string; profileImage: string; userId: string }[] = [];

    result.docs.forEach((doc) => {
      const curNickname = doc.data().nickname;
      const curUserId = doc.id;
      const curUserProfileImage = doc.data().profileImage;
      if (!curNickname.includes(filteredKeyword)) return;

      newTargets.push({ nickname: curNickname, profileImage: curUserProfileImage, userId: curUserId });
    });

    setTargets(newTargets);
  };

  useEffect(() => {
    if (!user) return;

    if (!isExp(user.uid as string)) return;

    alert(ALERT_TITLE.EXP, ALERT_CONTENT.INVALID_EXP);
    Router.push("/");
    return;
  }, [alert, user]);

  useEffect(() => {
    document.addEventListener("click", onClickOutSide);
    return () => {
      document.removeEventListener("click", onClickOutSide);
    };
  });

  return (
    <Layout>
      <div className="p-[10px] pt-[25px]">
        <form
          className={`flex-middle w-[80%] min-w-[200px] max-w-[700px] mx-auto pl-[15px] pr-[10px] pb-[10px] rounded-[10px] ${
            focus ? "bg-bcvl" : ""
          }`}
          onSubmit={getSearchResult}
        >
          <Icon
            className={`md:text-[28px] mobile:text-[20px] ${focus ? "text-bcd" : ""}`}
            icon="ic:baseline-search"
          />
          <input
            ref={ref}
            className={`w-full md:text-[20px] mobile:text-[14px] ml-[10px] my-[5px] px-[5px] md:py-[15px] mobile:py-[10px] outline-0 border-b border-bs ${
              focus ? "!border-bc bg-bcvl" : ""
            }`}
            type="text"
            name="search-user"
            value={keyword}
            onChange={onChange}
            onFocus={() => {
              setFocus(true);
            }}
            placeholder="사용자 검색"
          />
        </form>
        {targets ? (
          <div className="mt-[10px]">
            {targets.map(({ nickname, profileImage, userId }) => (
              <div
                key={userId}
                className="w-[468px] mobile:w-[300px] bg-bcvl rounded-[8px] mx-auto my-[7px] p-[7px]"
              >
                <UserCard nickname={nickname} profileImage={profileImage} userId={userId} />
              </div>
            ))}
            {targets.length === 0 ? <div>일치하는 사용자가 없습니다.</div> : null}
          </div>
        ) : null}
      </div>
    </Layout>
  );
};

export default withHead(Search, HEAD_TITLE.USER_SEARCH, HEAD_DESCRIPTION.USER_SEARCH);
