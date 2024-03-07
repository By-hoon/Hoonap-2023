import { useEffect, useState } from "react";
import Comment, { CommentProps } from "./Comment";
import CommentInput from "./CommentInput";
import { useRouter } from "next/router";
import useClickOutside from "@/hooks/useClickOutside";
import getSnapshot from "@/firebase/firestore/getSnapshot";
import { Icon } from "@iconify/react";
import { COMMENT_SORT_TYPES } from "@/shared/constants";
import { isExp } from "@/utils/util";

const Comments = ({ storyId, userId: storyUserId }: { storyId: string; userId: string }) => {
  const [comments, setComments] = useState<CommentProps[]>([]);
  const [sortType, setSortType] = useState(COMMENT_SORT_TYPES[0]);
  const { show, ref, onClickTarget } = useClickOutside();
  const { show: showSortMenu, ref: sortMenuRef, onClickTarget: onClickSortMenu } = useClickOutside();

  const router = useRouter();

  const doSortComments = (e: React.MouseEvent<HTMLElement>, type: { CODE: string; NAME: string }) => {
    e.stopPropagation();
    const newComments = [...comments];
    newComments.sort((a, b) => {
      if (type.CODE === "earliest") return a.writedAt - b.writedAt;

      return b.writedAt - a.writedAt;
    });

    setComments(newComments);
    setSortType(type);
    onClickSortMenu();
  };

  const commentsProcess = (data: { [key: string]: any }) => {
    if (!data) return [];

    const newData: CommentProps[] = [];
    Object.keys(data).forEach((key) => {
      newData.push(Object.assign(data[key], { commentId: key }));
    });

    newData.sort((a, b) => b.writedAt - a.writedAt);
    setSortType(COMMENT_SORT_TYPES[0]);
    return newData;
  };

  useEffect(() => {
    if (isExp(storyUserId)) return;

    return getSnapshot("comments", storyId, setComments, commentsProcess);
  }, [storyId, storyUserId]);

  const commentRender = () => {
    switch (router.pathname) {
      case "/story/list": {
        if (comments.length === 0)
          return (
            <div className="mt-[5px]">
              <CommentInput storyId={storyId} />
            </div>
          );
        return (
          <div ref={ref}>
            <div className="cursor-pointer text-zinc-600 text-[15px] my-[5px]" onClick={onClickTarget}>
              {comments.length}개의 댓글
            </div>
            <div>
              <CommentInput storyId={storyId} />
            </div>
            {show ? (
              <>
                <div className="background-shadow !fixed" onClick={onClickTarget} />
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] mobile:w-[250px] bg-white rounded-[6px] p-[10px] z-30">
                  <div className="text-[18px] text-center font-semibold border-b pb-[5px]">댓글 목록</div>
                  <div
                    ref={sortMenuRef}
                    className="relative flex text-[14px] pt-[5px] border-t mobile:mt-[5px]"
                  >
                    <div className="cursor-pointer flex items-center text-[14px]" onClick={onClickSortMenu}>
                      {sortType.NAME} <Icon icon="mingcute:down-line" className="text-[18px] ml-[5px]" />
                    </div>
                    {showSortMenu ? (
                      <div className="absolute top-[5px] right-0 text-[14px] bg-white rounded-[6px] shadow-basic pl-[10px] py-[5px]">
                        {COMMENT_SORT_TYPES.map((commentSortType) => (
                          <div className="grid grid-cols-[1fr_30px]" key={commentSortType.CODE}>
                            <div
                              className="cursor-pointer"
                              onClick={(e) => doSortComments(e, commentSortType)}
                            >
                              {commentSortType.NAME}
                            </div>
                            <div className="flex-middle">
                              <Icon
                                icon={`grommet-icons:radial${
                                  commentSortType.CODE === sortType.CODE ? "-selected" : ""
                                }`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <div className="md:max-h-[500px] mobile:max-h-[400px] overflow-y-scroll scrollbar-hide">
                    {comments.map(({ commentId, comment, writedAt, writedBy }) => (
                      <div key={commentId}>
                        <Comment
                          commentId={commentId}
                          comment={comment}
                          writedAt={writedAt}
                          writedBy={writedBy}
                          storyId={storyId}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="pt-[5px] border-t">
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
          <div className="mobile:relative w-full h-full md:grid md:grid-rows-[auto_1fr_36px]">
            <div ref={sortMenuRef} className="relative flex pt-[5px] border-t mobile:mt-[5px]">
              <div className="cursor-pointer flex items-center text-[14px]" onClick={onClickSortMenu}>
                {sortType.NAME} <Icon icon="mingcute:down-line" className="text-[18px] ml-[5px]" />
              </div>
              {showSortMenu ? (
                <div className="absolute top-[5px] right-0 text-[14px] bg-white rounded-[6px] shadow-basic pl-[10px] py-[5px]">
                  {COMMENT_SORT_TYPES.map((commentSortType) => (
                    <div className="grid grid-cols-[1fr_30px]" key={commentSortType.CODE}>
                      <div className="cursor-pointer" onClick={(e) => doSortComments(e, commentSortType)}>
                        {commentSortType.NAME}
                      </div>
                      <div className="flex-middle">
                        <Icon
                          icon={`grommet-icons:radial${
                            commentSortType.CODE === sortType.CODE ? "-selected" : ""
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="border-b overflow-y-scroll scrollbar-hide mobile:mb-[36px]">
              {comments.map(({ commentId, comment, writedAt, writedBy }) => (
                <div key={commentId}>
                  <Comment
                    commentId={commentId}
                    comment={comment}
                    writedAt={writedAt}
                    writedBy={writedBy}
                    storyId={storyId}
                  />
                </div>
              ))}
            </div>
            <div className="w-full py-[5px] mobile:fixed mobile:bottom-0 mobile:right-0 mobile:px-[25px] mobile:py-[10px] mobile:bg-white">
              <CommentInput storyId={storyId} />
            </div>
          </div>
        );
      }
      default:
        return null;
    }
  };

  return <div className="w-full h-full">{commentRender()}</div>;
};

export default Comments;
