import BasicImage from "@/components/common/BasicImage";
import Folding from "@/components/common/Folding";
import Layout from "@/components/common/Layout";
import { PopUpContext } from "@/context/popUpProvider";
import deleteFieldFunc from "@/firebase/firestore/deleteField";
import getDocument from "@/firebase/firestore/getDocument";
import { ALERT_CONTENT, ALERT_TITLE, CONFIRM_CONTENT, CONFIRM_TITLE } from "@/shared/constants";
import { cardSizeCalculator, getElapsedTime } from "@/utils/util";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";

const Log = () => {
  const [likes, setLikes] = useState<{ imageId: string; imageUrl: string; storyId: string }[]>([]);
  const [comments, setComments] = useState<
    { commentId: string; comment: string; writedAt: number; storyId: string }[]
  >([]);
  const [cardSize, setCardSize] = useState(0);
  const [isLikeEdit, setIsLikeEdit] = useState(false);
  const [isCommentsEdit, setIsCommentsEdit] = useState(false);
  const [selectedLike, setSelectedLike] = useState<{ [key: string]: boolean }>({});
  const [selectedComment, setSelectedComment] = useState<{ [key: string]: string }>({});

  const { alert, confirm } = useContext(PopUpContext);

  const sizeRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const { userId } = router.query;

  const startLikesEdit = () => {
    setIsLikeEdit(true);
  };

  const endLikesEdit = () => {
    setSelectedLike({});
    setIsLikeEdit(false);
  };

  const selectLike = (id: string) => {
    const newSelectedLike = JSON.parse(JSON.stringify(selectedLike));

    if (newSelectedLike[id]) delete newSelectedLike[id];
    else newSelectedLike[id] = true;

    setSelectedLike(newSelectedLike);
  };

  const selectAllLikes = () => {
    const newSelectedLike: { [key: string]: boolean } = {};

    likes.forEach((like) => {
      newSelectedLike[like.imageId] = true;
    });

    setSelectedLike(newSelectedLike);
  };

  const deleteLikes = async () => {
    if (Object.keys(selectedLike).length === 0) {
      setIsLikeEdit(false);
      alert(ALERT_TITLE.DELETE, ALERT_CONTENT.UNSELECTED);
      return;
    }

    const result = await confirm(CONFIRM_TITLE.DELETE_LIKES, CONFIRM_CONTENT.DELETE_LIKES);
    if (!result) return;

    const promise = Object.keys(selectedLike).map(async (selectedId) => {
      await deleteFieldFunc("likes", userId as string, selectedId);
      await deleteFieldFunc("likes-calc", selectedId, userId as string);
    });

    await Promise.all(promise);

    const newLikes: { imageId: string; imageUrl: string; storyId: string }[] = likes.filter(
      ({ imageId }) => !selectedLike[imageId]
    );

    setLikes(newLikes);
    setSelectedLike({});
    setIsLikeEdit(false);
  };

  const startCommentsEdit = () => {
    setIsCommentsEdit(true);
  };

  const endCommentsEdit = () => {
    setSelectedComment({});
    setIsCommentsEdit(false);
  };

  const selectComment = (commentId: string, storyId: string) => {
    const newSelectedComment = JSON.parse(JSON.stringify(selectedComment));

    if (newSelectedComment[commentId]) delete newSelectedComment[commentId];
    else newSelectedComment[commentId] = storyId;

    setSelectedComment(newSelectedComment);
  };

  const selectAllComments = () => {
    const newSelectedComment: { [key: string]: string } = {};

    comments.forEach((comment) => {
      newSelectedComment[comment.commentId] = comment.storyId;
    });

    setSelectedComment(newSelectedComment);
  };

  const deleteComments = async () => {
    if (Object.keys(selectedComment).length === 0) {
      setIsCommentsEdit(false);
      alert(ALERT_TITLE.DELETE, ALERT_CONTENT.UNSELECTED);
      return;
    }

    const result = await confirm(CONFIRM_TITLE.DELETE_COMMENTS, CONFIRM_CONTENT.DELETE_COMMENTS);
    if (!result) return;

    const promise = Object.keys(selectedComment).map(async (selectedId) => {
      await deleteFieldFunc("comments", selectedComment[selectedId], selectedId);
      await deleteFieldFunc("comments-user", userId as string, selectedId);
    });

    await Promise.all(promise);

    const newComments: { commentId: string; comment: string; writedAt: number; storyId: string }[] =
      comments.filter(({ commentId }) => !selectedComment[commentId]);

    setComments(newComments);
    setSelectedComment({});
    setIsCommentsEdit(false);
  };

  useEffect(() => {
    if (!userId) return;

    const getUserLikes = async () => {
      const newLikes: { imageId: string; imageUrl: string; storyId: string }[] = [];

      const likesResult = await getDocument("likes", userId as string);
      if (!likesResult || likesResult.empty) return;

      Object.keys(likesResult).forEach((imageId) => {
        newLikes.push({ imageId, imageUrl: likesResult[imageId].url, storyId: likesResult[imageId].storyId });
      });

      setLikes(newLikes);
    };

    const getUserComments = async () => {
      const newComments: { commentId: string; comment: string; writedAt: number; storyId: string }[] = [];

      const commentsResult = await getDocument("comments-user", userId as string);
      if (!commentsResult || commentsResult.empty) return;

      Object.keys(commentsResult).forEach((commentId) => {
        newComments.push({
          commentId,
          comment: commentsResult[commentId].comment,
          writedAt: commentsResult[commentId].writedAt,
          storyId: commentsResult[commentId].storyId,
        });
      });

      setComments(newComments);
    };

    getUserLikes();
    getUserComments();
  }, [userId]);

  useEffect(() => {
    const handleResize = () => {
      if (!sizeRef.current) return;
      const curWidth = sizeRef.current?.offsetWidth - 1;

      const curSize = cardSizeCalculator(curWidth);

      setCardSize(curSize);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Layout>
      <div className="w-[90%] max-w-[768px] mx-auto md:pt-[20px] mobile:pt-[10px] pb-[10px]">
        <div>
          <div className="w-full flex justify-between items-end my-[5px] px-[10px] pb-[10px] outline-0 border-b border-bs">
            <div className="text-[18px] mobile:text-[16px] font-semibold">좋아요를 표시한 사진들</div>
            {isLikeEdit ? (
              <div className="cursor-pointer text-[15px] mobile:text-[14px]" onClick={endLikesEdit}>
                취소
              </div>
            ) : (
              <div className="cursor-pointer text-[15px] mobile:text-[14px] text-bc" onClick={startLikesEdit}>
                편집
              </div>
            )}
          </div>
          {isLikeEdit ? (
            <div className="w-full flex justify-between text-[15px] mobile:text-[14px] my-[5px] px-[10px]">
              <div className="cursor-pointer" onClick={selectAllLikes}>
                전체 선택
              </div>
              <div className="cursor-pointer text-red-400" onClick={deleteLikes}>
                삭제
              </div>
            </div>
          ) : null}
          <div ref={sizeRef}>
            <Folding>
              {likes.map((like) => (
                <div
                  key={like.imageId}
                  className="relative cursor-pointer text-[18px] mobile:text-[14px] m-[5px]"
                  style={{
                    width: `${cardSize}px`,
                    height: `${cardSize}px`,
                  }}
                >
                  <div
                    className="w-full h-full"
                    onClick={() => {
                      router.push(
                        {
                          pathname: "/story/detail",
                          query: { storyId: like.storyId },
                        },
                        "/story/detail"
                      );
                    }}
                  >
                    <BasicImage
                      style={"relative w-full h-full rounded-[10px] bg-black overflow-hidden"}
                      url={like.imageUrl}
                      alt={"user-story-image"}
                    />
                  </div>
                  {isLikeEdit ? (
                    <div
                      className="absolute top-0 left-0 w-full h-full flex-middle bg-black bg-opacity-30 rounded-[10px] z-30"
                      onClick={() => selectLike(like.imageId)}
                    >
                      <Icon
                        icon="material-symbols:check-box-outline"
                        className={`text-[68px] mobile:text-[52px] ${
                          selectedLike[like.imageId] ? "text-green-400" : "text-zinc-300"
                        }`}
                      />
                    </div>
                  ) : null}
                </div>
              ))}
            </Folding>
          </div>
          <div className="w-full flex justify-between items-end mt-[10px] mb-[5px] px-[10px] pb-[10px] outline-0 border-b border-bs">
            <div className="text-[18px] mobile:text-[16px] font-semibold">작성한 댓글들</div>
            {isCommentsEdit ? (
              <div className="cursor-pointer text-[15px] mobile:text-[14px]" onClick={endCommentsEdit}>
                취소
              </div>
            ) : (
              <div
                className="cursor-pointer text-[15px] mobile:text-[14px] text-bc"
                onClick={startCommentsEdit}
              >
                편집
              </div>
            )}
          </div>
          {isCommentsEdit ? (
            <div className="w-full flex justify-between text-[15px] mobile:text-[14px] my-[5px] px-[10px]">
              <div className="cursor-pointer" onClick={selectAllComments}>
                전체 선택
              </div>
              <div className="cursor-pointer text-red-400" onClick={deleteComments}>
                삭제
              </div>
            </div>
          ) : null}
          <Folding>
            {comments.map((comment, index) => (
              <div
                key={index}
                className="cursor-pointer relative border md:w-[47%] mobile:w-full h-[74px] mx-[10px] my-[8px] rounded-[10px] shadow-basic"
              >
                <div
                  className="w-full h-full grid md:grid-cols-[1fr_100px] mobile:grid-cols-[5fr_2fr]"
                  onClick={() => {
                    router.push(
                      {
                        pathname: "/story/detail",
                        query: { storyId: comment.storyId },
                      },
                      "/story/detail"
                    );
                  }}
                >
                  <div className="text-[14px] text-center p-[5px] text-overflow-3">{comment.comment}</div>
                  <div className="text-[14px] text-zinc-400 flex-middle">
                    {getElapsedTime(comment.writedAt)}
                  </div>
                </div>
                {isCommentsEdit ? (
                  <div
                    className="absolute top-0 left-0 w-full h-full flex-middle bg-black bg-opacity-30 rounded-[10px] z-30"
                    onClick={() => selectComment(comment.commentId, comment.storyId)}
                  >
                    <Icon
                      icon="material-symbols:check-box-outline"
                      className={`text-[52px] mobile:text-[42px] ${
                        selectedComment[comment.commentId] ? "text-green-400" : "text-zinc-300"
                      }`}
                    />
                  </div>
                ) : null}
              </div>
            ))}
          </Folding>
        </div>
      </div>
    </Layout>
  );
};

export default Log;
