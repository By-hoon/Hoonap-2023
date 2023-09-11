import Image from "next/image";
import { ReactNode } from "react";

interface BasicImageProps {
  style: string;
  url: string;
  alt: string;
  children: ReactNode;
}

const BasicImage = ({ style, url, alt, children }: BasicImageProps) => {
  return (
    <figure className={style}>
      <Image
        src={url}
        alt={alt}
        className="!relative object-contain"
        sizes="(max-width: 768px) 50vw, 100vw"
        fill
      />
      {children}
    </figure>
  );
};

export default BasicImage;
