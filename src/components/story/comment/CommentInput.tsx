import { useCallback, useState } from "react";
import Button from "@/components/common/Button";
import { Icon } from "@iconify/react";
import { isExp } from "@/utils/util";
import setData from "@/firebase/firestore/setData";

const CommentInput = ({ storyId, userId }: { storyId: string; userId: string }) => {
  const [comment, setComment] = useState("");

  const onChangeComment = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  }, []);

  const addComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const commentData: { [key: string]: {} } = {};
    commentData[`${Date.now()} ${userId}`] = { comment, writedAt: Date.now(), writedBy: userId };

    if (isExp(userId)) {
      console.log(commentData);
    }

    const commentsResulut = await setData("comments", storyId, commentData);
  };

  return (
    <form onSubmit={addComment}>
      <div className="flex">
        <input
          className="w-full outline-none"
          type="text"
          value={comment}
          placeholder="댓글 추가"
          onChange={onChangeComment}
          required
        />
        <Button text={<Icon icon="iconamoon:send-thin" />} style="" type="submit" />
      </div>
    </form>
  );
};

export default CommentInput;
