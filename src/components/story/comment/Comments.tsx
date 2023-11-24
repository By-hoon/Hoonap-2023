import getDocument from "@/firebase/firestore/getDocument";
import { useEffect, useState } from "react";
import Comment, { CommentProps } from "./Comment";

const Comments = ({ storyId, userId }: { storyId: string; userId: string }) => {
  const [comments, setComments] = useState<CommentProps[]>([]);

  useEffect(() => {
    const getStory = async () => {
      const result = await getDocument("comments", storyId as string);

      if (!result) return;

      const newComments: CommentProps[] = [];
      Object.keys(result).forEach((key) => {
        newComments.push(Object.assign(result[key], { commentId: key }));
      });

      setComments(newComments);
    };

    getStory();
  }, [storyId]);

  return (
    <div className="w-full">
      {comments.map(({ commentId, comment, writedAt, writedBy }) => (
        <div key={commentId}>
          <Comment commentId={commentId} comment={comment} writedAt={writedAt} writedBy={writedBy} />
        </div>
      ))}
    </div>
  );
};

export default Comments;
