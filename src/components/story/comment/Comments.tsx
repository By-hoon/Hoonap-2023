import { useEffect, useState } from "react";
import Comment, { CommentProps } from "./Comment";
import CommentInput from "./CommentInput";
import { useRouter } from "next/router";
import useClickOutside from "@/hooks/useClickOutside";
import getSnapshot from "@/firebase/firestore/getSnapshot";

const Comments = ({ storyId, userId }: { storyId: string; userId: string }) => {
  const [comments, setComments] = useState<CommentProps[]>([]);
  const { show, ref, onClickTarget } = useClickOutside();

  const router = useRouter();

  const commentsProcess = (data: { [key: string]: any }) => {
    if (!data) return [];

    const newData: CommentProps[] = [];
    Object.keys(data).forEach((key) => {
      newData.push(Object.assign(data[key], { commentId: key }));
    });

    return newData;
  };

  useEffect(() => {
    return getSnapshot("comments", storyId, setComments, commentsProcess);
  }, [storyId]);

  const commentRender = () => {
    switch (router.pathname) {
      case "/story/list": {
        if (comments.length === 0) return <></>;
        return (
          <div ref={ref}>
            <div className="cursor-pointer" onClick={onClickTarget}>
              {comments.length}개의 댓글
            </div>
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
