import { useAuth } from "@/context/authProvider";
import useClickOutside from "@/hooks/useClickOutside";
import useUser from "@/hooks/useUser";
import { getElapsedTime } from "@/utils/util";
import { Icon } from "@iconify/react";
import MenuButton from "../MenuButton";

export interface CommentProps {
  commentId: string;
  comment: string;
  writedAt: number;
  writedBy: string;
}

const Comment = ({ commentId, comment, writedAt, writedBy }: CommentProps) => {
  const { show, ref, onClickTarget } = useClickOutside();

  const { user } = useAuth();

  const { nickname } = useUser(writedBy);

  return (
    <div className="my-[10px]" ref={ref}>
      <div className="grid grid-cols-[1fr_30px]">
        <div>
          <div className="flex text-[12px] mb-[2px]">
            <div className="font-semibold">{nickname}</div>
            <div className="text-zinc-600 ml-[5px]">{getElapsedTime(writedAt)}</div>
          </div>
          <div>{comment}</div>
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
        </div>
        {writedBy === user?.uid ? (
          <div
            className="cursor-pointer flex justify-center items-center text-[24px]"
            onClick={onClickTarget}
          >
            <Icon icon="pepicons-pencil:dots-y" />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Comment;
