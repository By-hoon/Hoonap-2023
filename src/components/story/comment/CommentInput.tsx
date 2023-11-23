import { useCallback, useState } from "react";
import Button from "@/components/common/Button";
import { Icon } from "@iconify/react";
import { isExp } from "@/utils/util";
import setData from "@/firebase/firestore/setData";
import { useAuth } from "@/context/authProvider";

const CommentInput = ({ storyId }: { storyId: string }) => {
  const [comment, setComment] = useState("");

  const { user } = useAuth();

  const onChangeComment = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  }, []);

  const addComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setComment("");

    const writerId = user?.uid || "unknown";

    const commentData: { [key: string]: {} } = {};
    commentData[`${Date.now()} ${writerId}`] = { comment, writedAt: Date.now(), writedBy: writerId };

    if (isExp(writerId)) {
      addExpComment(commentData);
      return;
    }

    const commentsResulut = await setData("comments", storyId, commentData);
  };

  const addExpComment = (commentData: { [key: string]: {} }) => {
    const storageComments = window.localStorage.getItem("comments");

    const expComments = storageComments ? JSON.parse(storageComments) : {};

    Object.assign(expComments, commentData);

    window.localStorage.setItem("comments", JSON.stringify(expComments));
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
