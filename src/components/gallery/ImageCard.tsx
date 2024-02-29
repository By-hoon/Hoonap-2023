import { useState } from "react";

const ImageCard = ({ url }: { url: string }) => {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  return (
    <div
      className="md:w-[150px] md:h-[150px] w-[140px] h-[140px] mx-[5px] mb-[40px]"
      style={{
        transform: `perspective(300px) rotateX(${mouseX}deg) rotateY(${mouseY}deg)`,
      }}
      onMouseMove={(e) => {
        let x = e.nativeEvent.offsetX;
        let y = e.nativeEvent.offsetY;

        let rotateY = (-4 / 15) * x + 20;
        let rotateX = (4 / 15) * y - 20;

        setMouseX(rotateX);
        setMouseY(rotateY);
      }}
      onMouseLeave={() => {
        setMouseX(0);
        setMouseY(0);
      }}
    >
      <div
        className={`cursor-pointer relative w-full h-full bg-contain bg-no-repeat bg-center 
      rounded-[8px]`}
        style={{
          backgroundImage: `url(${url})`,
        }}
      >
        <div
          className="w-full h-full absolute scale-95 translate-y-[36px] translate-z-[-30px] bg-contain blur-lg opacity-90 -z-30"
          style={{ backgroundImage: "inherit" }}
        />
      </div>
    </div>
  );
};

export default ImageCard;
