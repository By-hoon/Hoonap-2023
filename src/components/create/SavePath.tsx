import dynamic from "next/dynamic";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

interface SavePathProps {
  paths: {
    latitude: number;
    longitude: number;
  }[];
  setPaths: Dispatch<
    SetStateAction<
      {
        latitude: number;
        longitude: number;
      }[]
    >
  >;
}

const SavePath = ({ paths, setPaths }: SavePathProps) => {
  return (
    <div>
      <Map paths={paths} setPaths={setPaths} />
    </div>
  );
};

export default SavePath;
