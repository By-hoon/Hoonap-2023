export interface CommentProps {
  commentId: string;
  comment: string;
  writedAt: number;
  writedBy: string;
}

const Comment = ({ commentId, comment, writedAt, writedBy }: CommentProps) => {
  return (
    <div>
      <div>
        <div>{writedBy}</div>
        <div>{writedAt}</div>
      </div>
      <div>{comment}</div>
    </div>
  );
};

export default Comment;
