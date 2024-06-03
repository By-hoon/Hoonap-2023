import useClickOutside from "@/hooks/useClickOutside";
import MenuButton from "../MenuButton";
import { useAuth } from "@/context/authProvider";
import { CommentProps } from "./Comment";
import { Icon } from "@iconify/react";
import { useCallback, useState } from "react";
import updateField from "@/firebase/firestore/updateField";
import deleteField from "@/firebase/firestore/deleteField";

interface CommentMenuProps extends CommentProps {
  storyId: string;
}

const CommentMenu = ({ commentId, comment, writedAt, writedBy, storyId }: CommentMenuProps) => {
  const [newComment, setNewComment] = useState(comment);

  const { user } = useAuth();

  const { show, ref, onClickTarget } = useClickOutside();

  const onChangeComment = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(e.target.value);
  }, []);

  const closeMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setNewComment(comment);
    onClickTarget();
  };

  const updateComment = async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    if (!user) return;

    await updateField("comments", storyId, commentId, {
      comment: newComment,
      writedAt,
      writedBy: user.uid,
      storyId,
    });
    await updateField("comments-user", user.uid, commentId, {
      comment: newComment,
      writedAt,
      writedBy: user.uid,
      storyId,
    });

    onClickTarget();
  };

  const deleteComment = async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    await deleteField("comments", storyId, commentId);
    onClickTarget();
  };

  return (
    <div ref={ref}>
      {show ? (
        <>
          <div className="background-shadow !fixed" onClick={closeMenu} />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] mobile:w-[250px] font-semibold text-[18px] bg-white rounded-[6px] z-40 overflow-hidden">
            <div className="mb-[10px] px-[10px] pt-[10px]">
              <div className="grid grid-cols-[1fr_50px] rounded-[5px] p-[5px] border-2 focus-within:border-bc">
                <input
                  className="text-[16px] outline-none"
                  type="text"
                  value={newComment}
                  placeholder="수정할 댓글 입력"
                  onChange={onChangeComment}
                />
                <MenuButton name={"수정"} style="text-bc !m-0 !p-0" onClick={updateComment} />
              </div>
            </div>
            <div className="grid grid-cols-[1fr_1fr]">
              <MenuButton name={"취소"} style="bg-zinc-200 !m-0" onClick={closeMenu} />
              <MenuButton
                name={"삭제"}
                style="text-red-600 text-white bg-red-500 !m-0"
                onClick={deleteComment}
              />
            </div>
          </div>
        </>
      ) : null}
      {writedBy === user?.uid ? (
        <div className="cursor-pointer h-full flex-middle text-[24px]" onClick={onClickTarget}>
          <Icon icon="pepicons-pencil:dots-y" />
        </div>
      ) : null}
    </div>
  );
};

export default CommentMenu;
