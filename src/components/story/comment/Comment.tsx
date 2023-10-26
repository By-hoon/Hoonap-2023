interface CommentProps {
  comment: string;
  createdAt: number;
  userId: string;
}

const Comment = ({ comment, createdAt, userId }: CommentProps) => {
  return (
    <div>
      <div>
        <div>{userId}</div>
        <div>{createdAt}</div>
      </div>
      <div>{comment}</div>
    </div>
  );
};

export default Comment;
