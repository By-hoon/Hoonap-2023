import { ChangeEvent } from "react";

const SaveImage = () => {
  const uploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
  };

  return (
    <div>
      <input type="file" accept="image/*" multiple onChange={uploadImage} />
    </div>
  );
};

export default SaveImage;
