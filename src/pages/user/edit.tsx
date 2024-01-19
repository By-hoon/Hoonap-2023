import BasicImage from "@/components/common/BasicImage";
import Button from "@/components/common/Button";
import Layout from "@/components/common/Layout";
import withHead from "@/components/hoc/withHead";
import { PopUpContext } from "@/context/popUpProvider";
import updateField from "@/firebase/firestore/updateField";
import useUser from "@/hooks/useUser";
import { alertContent, alertTitle, headDescription, headTitle } from "@/shared/constants";
import Router, { useRouter } from "next/router";
import { ChangeEvent, useContext, useEffect, useState } from "react";

const UserEdit = () => {
  const [fileData, setFileData] = useState<File>();
  const [previewImage, setPreviewImage] = useState<string>();

  const router = useRouter();
  const { userId } = router.query;

  const { nickname, setNickname } = useUser(userId as string);

  const { alert } = useContext(PopUpContext);

  const uploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.currentTarget.files === null) return;
    if (e.currentTarget.files.length === 0) return;

    const newFileData = e.currentTarget.files[0];

    const fileUrl = URL.createObjectURL(newFileData);
    setPreviewImage(fileUrl);

    setFileData(newFileData);
  };

  const changeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const editUser = async () => {
    if (nickname === "") {
      alert(alertTitle.input, `닉네임 ${alertContent.requireValue}`);
      return;
    }
    await updateField("users", userId as string, "nickname", nickname);

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
        <div className="flex-middle">
          <label htmlFor="preview">
            <div className="cursor-pointer w-[200px] h-[200px] mobile:w-[140px] mobile:h-[140px] rounded-[10px] border-2 p-[5px]">
              {previewImage ? (
                <BasicImage style={"w-full h-full"} url={previewImage} alt={"upload-image"} />
              ) : (
                <div className="relative w-full h-full bg-zinc-200">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[15px] text-zinc-400 font-semibold">
                    사진 등록
                  </div>
                </div>
              )}
            </div>
          </label>
          <input id="preview" className="hidden" type="file" accept="image/*" onChange={uploadImage} />
        </div>
        <div className="mt-[20px] px-[10px]">
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
