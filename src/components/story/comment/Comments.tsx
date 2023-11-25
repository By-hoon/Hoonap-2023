import getDocument from "@/firebase/firestore/getDocument";
import { useEffect, useState } from "react";
import Comment, { CommentProps } from "./Comment";
import CommentInput from "./CommentInput";
import { useRouter } from "next/router";
import useClickOutside from "@/hooks/useClickOutside";

const Comments = ({ storyId, userId }: { storyId: string; userId: string }) => {
  const [comments, setComments] = useState<CommentProps[]>([]);
  const { show, ref, onClickTarget } = useClickOutside();

  const router = useRouter();

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

  const commentRender = () => {
    switch (router.pathname) {
      case "/story/list": {
        if (comments.length === 0) return <></>;
        return (
          <div ref={ref}>
            <div onClick={onClickTarget}>{comments.length}개의 댓글</div>
            {show ? (
              <>
                <div className="background-shadow !fixed" onClick={onClickTarget} />
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] mobile:w-[250px] bg-white rounded-[6px] z-30">
                  {comments.map(({ commentId, comment, writedAt, writedBy }) => (
                    <div key={commentId}>
                      <Comment
                        commentId={commentId}
                        comment={comment}
                        writedAt={writedAt}
                        writedBy={writedBy}
                      />
                    </div>
                  ))}
                  <div className="mt-[5px]">
                    <CommentInput storyId={storyId} />
                  </div>
                </div>
              </>
            ) : null}
          </div>
        );
      }
      case "/story/detail": {
        return (
          <>
            {comments.map(({ commentId, comment, writedAt, writedBy }) => (
              <div key={commentId}>
                <Comment commentId={commentId} comment={comment} writedAt={writedAt} writedBy={writedBy} />
              </div>
            ))}
          </>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {commentRender()}
      <div className="mt-[5px]">
        <CommentInput storyId={storyId} />
      </div>
    </div>
  );
};

export default Comments;
