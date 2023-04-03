import useMap from "@/hooks/useMap";
import { Dispatch, SetStateAction, useEffect } from "react";

interface SavePathProps {
  path: {
    latitude: number;
    longitude: number;
  }[];
  setPath: Dispatch<
    SetStateAction<
      {
        latitude: number;
        longitude: number;
      }[]
    >
  >;
}

const SavePath = ({ path, setPath }: SavePathProps) => {
  const { targetPath, setMarker } = useMap();

  const deletePath = (index: number) => {
    const newPath = [...path];
    newPath.splice(index, 1);
    setPath(newPath);
  };

  useEffect(() => {
    if (targetPath) {
      setPath(path.concat(targetPath));
    }
  }, [targetPath]);

  return (
    <div>
      <div id="map" className="w-[400px] h-[400px]"></div>
      <div>
        {path.map((p, index) => (
          <div key={index}>
            <div>
              <div onClick={() => setMarker({ latitude: p.latitude, longitude: p.longitude })}>
                {index + 1}번 좌표
              </div>
              <button onClick={() => deletePath(index)}>삭제</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavePath;
