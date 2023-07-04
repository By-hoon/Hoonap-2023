import dynamic from "next/dynamic";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import MapOption from "./MapOption";
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

interface SavePathProps {
  paths: { latitude: number; longitude: number }[];
  setPaths: Dispatch<SetStateAction<{ latitude: number; longitude: number }[]>>;
}

const SavePath = ({ paths, setPaths }: SavePathProps) => {
  return (
    <div className="absolute w-[100%] h-[100%] mx-auto my-0 p-[15px]">
      <Map>
        <MapOption paths={paths} setPaths={setPaths} />
      </Map>
    </div>
  );
};

export default SavePath;
