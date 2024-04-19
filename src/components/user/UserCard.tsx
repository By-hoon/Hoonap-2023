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
      className="flex items-center"
      href={{
        pathname: "/user/detail",
        query: { userId: userId },
      }}
      as="/user/detail"
    >
      <ProfileImage
        imageUrl={profileImage}
        nickname={nickname}
        style={"w-[50px] h-[50px] text-[18px] mobile:w-[35px] mobile:h-[35px] mobile:text-[14px]"}
      />
      <div className="ml-[7px] mobile:text-[14px]">{nickname}</div>
    </Link>
  );
};

export default UserCard;
