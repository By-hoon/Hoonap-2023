import BasicImage from "@/components/common/BasicImage";
import Button from "@/components/common/Button";
import Layout from "@/components/common/Layout";
import withHead from "@/components/hoc/withHead";
import MenuButton from "@/components/story/MenuButton";
import ProfileImage from "@/components/user/ProfileImage";
import { PopUpContext } from "@/context/popUpProvider";
import updateField from "@/firebase/firestore/updateField";
import { addFile } from "@/firebase/storage/add";
import { deleteFile } from "@/firebase/storage/delete";
import useClickOutside from "@/hooks/useClickOutside";
import useUser from "@/hooks/useUser";
import { alertContent, alertTitle, headDescription, headTitle } from "@/shared/constants";
import Router, { useRouter } from "next/router";
import { ChangeEvent, useContext, useEffect, useState } from "react";

const UserEdit = () => {
  const [fileData, setFileData] = useState<File>();
  const [previewImage, setPreviewImage] = useState<string>();
  const [isDeleted, setIsDeleted] = useState(false);

  const router = useRouter();
  const { userId } = router.query;

  const { nickname, setNickname, profileImage } = useUser(userId as string);
  const { show: editMenu, ref: editMenuRef, onClickTarget: onClickEditMenu } = useClickOutside();
  const { alert } = useContext(PopUpContext);

  const uploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.currentTarget.files === null) return;
    if (e.currentTarget.files.length === 0) return;

    const newFileData = e.currentTarget.files[0];

    const fileUrl = URL.createObjectURL(newFileData);
    setPreviewImage(fileUrl);

    setFileData(newFileData);

    onClickEditMenu();
    setIsDeleted(false);
  };
  const deleteProfileImage = () => {
    setPreviewImage(undefined);
    setFileData(undefined);
    onClickEditMenu();
    setIsDeleted(true);
  };

  const changeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const editUser = async () => {
    const curUser = userId as string;
    if (nickname === "") {
      alert(alertTitle.input, `닉네임 ${alertContent.requireValue}`);
      return;
    }

    await updateField("users", curUser, "nickname", nickname);

    if (fileData) {
      const fileUrl = await addFile(fileData, curUser, "profile-image");
      await updateField("users", curUser, "profileImage", fileUrl);
      await deleteFile(profileImage);
    }

    if (isDeleted) {
      await updateField("users", curUser, "profileImage", "");
      await deleteFile(profileImage);
    }

    Router.push(
      {
        pathname: "/user/detail",
        query: { userId },
      },
      "/user/detail"
    );
  };

  useEffect(() => {
    if (!userId) {
      alert(alertTitle.access, alertContent.noUser);
      Router.push("/");
      return;
    }
  }, [alert, userId]);

  return (
    <Layout>
      <div className="max-w-[425px] min-w-[320px] mx-auto p-[5px] pt-[30px]">
        <div>
          <div>
            <div ref={editMenuRef}>
              <div
                className="cursor-pointer w-[140px] h-[140px] mobile:w-[140px] mobile:h-[140px] mx-auto"
                onClick={onClickEditMenu}
              >
                {previewImage ? (
                  <BasicImage
                    style={"relative w-full h-full bg-black rounded-[50%] overflow-hidden"}
                    url={previewImage}
                    alt={"upload-image"}
                  />
                ) : (
                  <ProfileImage
                    imageUrl={isDeleted ? "" : profileImage}
                    nickname={nickname}
                    style={"w-full h-full text-[36px]"}
                  />
                )}
              </div>
              <div
                className="cursor-pointer w-full text-[14px] text-bc text-center mt-[5px]"
                onClick={onClickEditMenu}
              >
                프로필 사진 변경
              </div>
              {editMenu ? (
                <div>
                  <div className="background-shadow !fixed" onClick={onClickEditMenu} />
                  <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] mobile:w-[250px] font-semibold text-[14px] bg-white px-[5px] rounded-[6px] z-30">
                    <div className="text-center text-[20px] font-normal border-b mb-[10px] py-[10px]">
                      프로필 사진 변경
                    </div>
                    <div>
                      <label htmlFor="preview">
                        <div className="cursor-pointer flex-middle text-bc m-[5px] p-[5px]">사진 선택</div>
                      </label>
                      <input
                        id="preview"
                        className="hidden"
                        type="file"
                        accept="image/*"
                        onChange={uploadImage}
                      />
                    </div>
                    <MenuButton name={"프로필 사진 삭제"} onClick={deleteProfileImage} />
                    <MenuButton name={"취소"} style="text-red-600" onClick={onClickEditMenu} />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="mt-[10px] px-[10px]">
          <input
            className="input-templete"
            type="text"
            value={nickname}
            placeholder="닉네임을 입력해 주세요"
            onChange={changeNickname}
            required
          />
        </div>
        <div className="w-[100%] text-center mt-[20px]">
          <Button
            text="취소"
            style="text-[18px] font-semibold border border-zinc-400 text-zinc-400 hover:text-white hover:bg-red-400 hover:border-red-400 mx-[5px] px-[14px] py-[6px] rounded-[10px]"
            onClick={() => {
              Router.back();
            }}
          />
          <Button
            text="수정"
            style="text-[18px] font-semibold border border-bc text-bc hover:text-white hover:bg-bc mx-[5px] px-[14px] py-[6px] rounded-[10px]"
            onClick={editUser}
          />
        </div>
      </div>
    </Layout>
  );
};

export default withHead(UserEdit, headTitle.userEdit, headDescription.userEdit);
