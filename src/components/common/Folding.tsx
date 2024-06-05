import { Icon } from "@iconify/react";
import { useState } from "react";

const Folding = ({ children }: { children: React.ReactNode }) => {
  const [isOpenLikes, setIsOpenLikes] = useState(false);

  return (
    <div>
      <div
        className={`flex flex-wrap ${
          isOpenLikes ? "" : "max-h-[300px] mobile:max-h-[250px] overflow-y-scroll scrollbar-hide"
        }`}
      >
        {children}
      </div>
      <div className="cursor-pointer w-full text-zinc-400 hover:bg-zinc-400 hover:bg-opacity-20 rounded-[10px] my-[5px]">
        {isOpenLikes ? (
          <div
            className="flex-middle"
            onClick={() => {
              setIsOpenLikes(false);
            }}
          >
            <Icon icon="bx:chevrons-up" className="text-[24px]" />
            <div className="text-[14px]">접기</div>
            <Icon icon="bx:chevrons-up" className="text-[24px]" />
          </div>
        ) : (
          <div
            className="flex-middle"
            onClick={() => {
              setIsOpenLikes(true);
            }}
          >
            <Icon icon="bx:chevrons-down" className="text-[24px]" />
            <div className="text-[14px]">펼치기</div>
            <Icon icon="bx:chevrons-down" className="text-[24px]" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Folding;
