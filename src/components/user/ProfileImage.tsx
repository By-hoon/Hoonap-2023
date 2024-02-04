import BasicImage from "../common/BasicImage";

interface ProfileImageProps {
  imageUrl: string;
  nickname: string;
  style: string;
}

const ProfileImage = ({ imageUrl, nickname, style }: ProfileImageProps) => {
  return (
    <>
      {imageUrl !== "" ? (
        <BasicImage
          style={`${style} relative bg-black rounded-[50%] overflow-hidden`}
          url={imageUrl}
          alt={"profile-image"}
        />
      ) : (
        <div className={`${style} bg-black text-center text-white rounded-[50%] overflow-hidden`}>
          {nickname[0]}
        </div>
      )}
    </>
  );
};

export default ProfileImage;
