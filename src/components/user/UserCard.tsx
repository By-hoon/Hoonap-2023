import Link from "next/link";

interface UserCardProps {
  nickname: string;
  userId: string;
}

const UserCard = ({ nickname, userId }: UserCardProps) => {
  return (
    <Link
      href={{
        pathname: "/user/detail",
        query: { userId: userId },
      }}
      as="/user/detail"
    >
      <div>{nickname}</div>
    </Link>
  );
};

export default UserCard;
