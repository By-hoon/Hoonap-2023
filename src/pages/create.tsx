import SavePath from "@/components/create/SavePath";
import { useEffect, useState } from "react";

export default function Create() {
  const [part, setPart] = useState("path");
  const [path, setPath] = useState<Array<{ latitude: number; longitude: number }>>([]);

  const partRender = () => {
    switch (part) {
      case "path": {
        return <SavePath path={path} setPath={setPath} />;
      }
      case "image": {
        return <>{/* 사진 업로드 */}</>;
      }
      case "story": {
        return <>{/* 내용 입력 */}</>;
      }
    }
    return null;
  };

  return <div>{partRender()}</div>;
}
