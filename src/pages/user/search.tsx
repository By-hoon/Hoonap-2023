import Layout from "@/components/common/Layout";
import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";

const Search = () => {
  const [focus, setFocus] = useState(false);

  const ref = useRef<HTMLInputElement>(null);

  const onClickOutSide = (e: any) => {
    if (focus && ref.current && !ref.current.contains(e.target)) {
      setFocus(false);
    }
  };

  const getSearchResult = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("get user result");
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
