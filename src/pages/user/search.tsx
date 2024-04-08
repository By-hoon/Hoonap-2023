import Layout from "@/components/common/Layout";
import { PopUpContext } from "@/context/popUpProvider";
import getCollection from "@/firebase/firestore/getCollection";
import { ALERT_CONTENT, ALERT_TITLE } from "@/shared/constants";
import { Icon } from "@iconify/react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

const Search = () => {
  const [focus, setFocus] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [targets, setTargets] = useState<{ nickname: string; userId: string }[] | undefined>();

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

    if (keyword === "") alert(ALERT_TITLE.INPUT, ALERT_CONTENT.REQUIRE_VALUE);

    const result = await getCollection("users");
    if (!result || result.empty) return;

    const newTargets: { nickname: string; userId: string }[] = [];

    result.docs.forEach((doc) => {
      const curNickname = doc.data().nickname;
      const curUserId = doc.id;
      if (!curNickname.includes(keyword)) return;

      newTargets.push({ nickname: curNickname, userId: curUserId });
    });

    setTargets(newTargets);
  };

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
      </div>
    </Layout>
  );
};

export default Search;
