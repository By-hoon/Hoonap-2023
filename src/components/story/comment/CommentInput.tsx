import { useCallback, useState } from "react";
import Button from "@/components/common/Button";
import { Icon } from "@iconify/react";

const CommentInput = () => {
  const [comment, setComment] = useState("");

  const onChangeComment = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  }, []);

  const addComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(comment);
  };

  return (
    <form onSubmit={addComment}>
      <div>
        <input
          className=""
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
