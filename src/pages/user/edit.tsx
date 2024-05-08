import BasicImage from "@/components/common/BasicImage";
import Button from "@/components/common/Button";
import Layout from "@/components/common/Layout";
import withHead from "@/components/hoc/withHead";
import MenuButton from "@/components/story/MenuButton";
import NicknameForm from "@/components/user/NicknameForm";
import ProfileImage from "@/components/user/ProfileImage";
import { PopUpContext } from "@/context/popUpProvider";
import updateField from "@/firebase/firestore/updateField";
import { addFile } from "@/firebase/storage/add";
import { deleteFile } from "@/firebase/storage/delete";
import useClickOutside from "@/hooks/useClickOutside";
import {
  ALERT_TITLE,
  ALERT_CONTENT,
  CONFIRM_TITLE,
  CONFIRM_CONTENT,
  HEAD_TITLE,
  HEAD_DESCRIPTION,
} from "@/shared/constants";
import Router, { useRouter } from "next/router";
import { ChangeEvent, useContext, useEffect, useState } from "react";

const UserEdit = () => {
  const [fileData, setFileData] = useState<File>();
  const [previewImage, setPreviewImage] = useState<string>();
  const [isDeleted, setIsDeleted] = useState(false);
  const [isPassNickname, setIsPassNickname] = useState(true);
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const router = useRouter();
  const { userId, nickname: previousNickname, profileImage: previousProfileImage } = router.query;

  const { show: editMenu, ref: editMenuRef, onClickTarget: onClickEditMenu } = useClickOutside();
  const { alert, confirm } = useContext(PopUpContext);

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
  const deleteProfileImage = async () => {
    const result = await confirm(CONFIRM_TITLE.DELETE_PROFILE_IMAGE, CONFIRM_CONTENT.DELETE_PROFILE_IMAGE);
    if (!result) return;

    setPreviewImage(undefined);
    setFileData(undefined);
    onClickEditMenu();
    setIsDeleted(true);
  };

  const editUser = async () => {
    const curUser = userId as string;
    if (nickname === "") {
      alert(ALERT_TITLE.INPUT, `닉네임 ${ALERT_CONTENT.REQUIRE_VALUE}`);
      return;
    }

    if (!isPassNickname) {
      alert(ALERT_TITLE.NICKNAME, ALERT_CONTENT.INVALID_NICKNAME);
      return;
    }

    await updateField("users", curUser, "nickname", nickname);

    if (fileData) {
      const fileUrl = await addFile(fileData, curUser, "profile-image");
      await updateField("users", curUser, "profileImage", fileUrl);
      await deleteFile(profileImage as string);
    }

    if (isDeleted) {
      await updateField("users", curUser, "profileImage", "");
      await deleteFile(profileImage as string);
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
      alert(ALERT_TITLE.ACCESS, ALERT_CONTENT.NO_USER);
      Router.push("/");
      return;
    }
  }, [alert, userId]);

  useEffect(() => {
    if (!previousNickname || !previousProfileImage) return;

    setNickname(previousNickname as string);
    setProfileImage(previousProfileImage as string);
  }, [previousNickname, previousProfileImage]);

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
                    imageUrl={isDeleted ? "" : (profileImage as string)}
                    nickname={nickname as string}
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
          <NicknameForm
            nickname={nickname}
            setNickname={setNickname}
            isPassNickname={isPassNickname}
            setIsPassNickname={setIsPassNickname}
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

export default withHead(UserEdit, HEAD_TITLE.USER_EDIT, HEAD_DESCRIPTION.USER_EDIT);
