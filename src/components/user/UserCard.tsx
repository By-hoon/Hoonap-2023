import Link from "next/link";
import ProfileImage from "./ProfileImage";

interface UserCardProps {
  nickname: string;
  profileImage: string;
  userId: string;
}

const UserCard = ({ nickname, profileImage, userId }: UserCardProps) => {
  return (
    <Link
      href={{
        pathname: "/user/detail",
        query: { userId: userId },
      }}
      as="/user/detail"
    >
      <ProfileImage imageUrl={profileImage} nickname={nickname} style={"w-[50px] h-[50px] text-[18px]"} />
      <div>{nickname}</div>
    </Link>
  );
};

export default UserCard;
