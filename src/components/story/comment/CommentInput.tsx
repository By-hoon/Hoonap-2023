import { useCallback, useContext, useState } from "react";
import Button from "@/components/common/Button";
import { Icon } from "@iconify/react";
import { isExp } from "@/utils/util";
import setData from "@/firebase/firestore/setData";
import { useAuth } from "@/context/authProvider";
import { PopUpContext } from "@/context/popUpProvider";
import { ALERT_TITLE, ALERT_CONTENT } from "@/shared/constants";

const CommentInput = ({ storyId }: { storyId: string }) => {
  const [comment, setComment] = useState("");

  const { user } = useAuth();

  const { alert } = useContext(PopUpContext);

  const onChangeComment = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  }, []);

  const addComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setComment("");

    const writerId = user?.uid || "unknown";

    const commentData: { [key: string]: {} } = {};
    commentData[`${Date.now()} ${writerId}`] = { comment, writedAt: Date.now(), writedBy: writerId, storyId };

    if (isExp(writerId)) {
      await alert(ALERT_TITLE.EXP, ALERT_CONTENT.INVALID_EXP);
      return;
    }

    const commentsResulut = await setData("comments", storyId, commentData);
    const commentsUserResulut = await setData("comments-user", writerId, commentData);
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
