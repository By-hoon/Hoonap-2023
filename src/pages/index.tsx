import useMap from "@/hooks/useMap";

export default function Home() {
  useMap();
  return <div id="map" className="w-[800px] h-[800px]"></div>;
}
