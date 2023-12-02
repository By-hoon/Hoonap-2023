import useClickOutside from "@/hooks/useClickOutside";
import MenuButton from "../MenuButton";
import { useAuth } from "@/context/authProvider";
import { CommentProps } from "./Comment";
import { Icon } from "@iconify/react";

const CommentMenu = ({ commentId, comment, writedAt, writedBy }: CommentProps) => {
  const { user } = useAuth();

  const { show, ref, onClickTarget } = useClickOutside();

  return (
    <div ref={ref}>
      {show ? (
        <>
          <div className="background-shadow !fixed" onClick={onClickTarget} />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] mobile:w-[250px] font-semibold text-[18px] bg-white rounded-[6px] z-30">
            <MenuButton
              name={"수정"}
              onClick={() => {
                console.log("수정");
              }}
            />
            <MenuButton
              name={"삭제"}
              style="text-red-600"
              onClick={() => {
                console.log("삭제");
              }}
            />
          </div>
        </>
      ) : null}
      {writedBy === user?.uid ? (
        <div
          className="cursor-pointer h-full flex justify-center items-center text-[24px]"
          onClick={onClickTarget}
        >
          <Icon icon="pepicons-pencil:dots-y" />
        </div>
      ) : null}
    </div>
  );
};

export default CommentMenu;
