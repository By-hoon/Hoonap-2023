import { useState } from "react";

const ImageCard = ({ url, cardSize }: { url: string; cardSize: number }) => {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  return (
    <div
      className={`mb-[40px]`}
      style={{
        width: `${cardSize}px`,
        height: `${cardSize}px`,
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
