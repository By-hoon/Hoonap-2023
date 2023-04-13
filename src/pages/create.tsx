import SaveImage from "@/components/create/SaveImage";
import SavePath from "@/components/create/SavePath";
import { useEffect, useState } from "react";

export default function Create() {
  const [part, setPart] = useState("image");
  const [path, setPath] = useState<Array<{ latitude: number; longitude: number }>>([]);

  const partRender = () => {
    switch (part) {
      case "path": {
        return <SavePath path={path} setPath={setPath} />;
      }
      case "image": {
        return <SaveImage />;
      }
      case "story": {
        return <>{/* 내용 입력 */}</>;
      }
    }
    return null;
  };

  return <div>{partRender()}</div>;
}
