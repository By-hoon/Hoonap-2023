import useMap from "@/hooks/useMap";

const SavePath = () => {
  useMap();
  return <div id="map" className="w-[400px] h-[400px]"></div>;
};

export default SavePath;
