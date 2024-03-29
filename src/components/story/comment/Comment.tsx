import useUser from "@/hooks/useUser";
import { getElapsedTime } from "@/utils/util";
import CommentMenu from "./CommentMenu";
import BasicImage from "@/components/common/BasicImage";
import ProfileImage from "@/components/user/ProfileImage";

export interface CommentProps {
  commentId: string;
  comment: string;
  writedAt: number;
  writedBy: string;
}

interface CommentAndStoryIdProps extends CommentProps {
  storyId: string;
}

const Comment = ({ commentId, comment, writedAt, writedBy, storyId }: CommentAndStoryIdProps) => {
  const { nickname, profileImage } = useUser(writedBy);

  return (
    <div className="my-[10px]">
      <div className="grid grid-cols-[45px_1fr_25px]">
        <div>
          <ProfileImage imageUrl={profileImage} nickname={nickname} style={"w-[40px] h-[40px]"} />
        </div>
        <div>
          <div className="flex text-[12px] mb-[2px]">
            <div className="font-semibold">{nickname}</div>
            <div className="text-zinc-600 ml-[5px]">{getElapsedTime(writedAt)}</div>
          </div>
          <div className="text-[14px] break-all">{comment}</div>
        </div>
        <CommentMenu
          commentId={commentId}
          comment={comment}
          writedAt={writedAt}
          writedBy={writedBy}
          storyId={storyId}
        />
      </div>
    </div>
  );
};

export default Comment;
