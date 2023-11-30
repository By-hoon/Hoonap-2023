import useUser from "@/hooks/useUser";
import { getElapsedTime } from "@/utils/util";

export interface CommentProps {
  commentId: string;
  comment: string;
  writedAt: number;
  writedBy: string;
}

const Comment = ({ commentId, comment, writedAt, writedBy }: CommentProps) => {
  const { nickname } = useUser(writedBy);

  return (
    <div className="my-[10px]">
      <div className="flex text-[12px] mb-[2px]">
        <div className="font-semibold">{nickname}</div>
        <div className="text-zinc-600 ml-[5px]">{getElapsedTime(writedAt)}</div>
      </div>
      <div>{comment}</div>
    </div>
  );
};

export default Comment;
