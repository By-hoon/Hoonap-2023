import { Dispatch, SetStateAction } from "react";
import BasicImage from "../common/BasicImage";
import Link from "next/link";

interface CurrentImageProps {
  current:
    | {
        url: string;
        userId: string;
        id: string;
      }
    | undefined;

  setCurrent: Dispatch<
    SetStateAction<
      | {
          url: string;
          userId: string;
          id: string;
        }
      | undefined
    >
  >;
}

const CurrentImage = ({ current, setCurrent }: CurrentImageProps) => {
  return (
    <>
      {current ? (
        <>
          <div
            className="background-shadow z-[110]"
            onClick={() => {
              setCurrent(undefined);
            }}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 rounded-[10px] z-[120]">
            <BasicImage
              style={"relative w-[768px] h-[768px] mobile:w-[300px] mobile:h-[300px]"}
              url={current.url}
              alt={"current-image"}
            >
              <div>
                <div className="absolute bottom-0 left-0 w-full h-[80px] mobile:h-[60px] flex-middle bg-black bg-opacity-30">
                  <Link
                    className="w-[210px] h-[50px] text-white text-[24px] text-center mobile:w-[180px] mobile:h-[40px] mobile:text-[20px] border rounded-[10px] px-[10px] py-[5px]"
                    href={{
                      pathname: "/story/detail",
                      query: { storyId: current.id },
                    }}
                    as="/story/detail"
                  >
                    스토리 보러가기
                  </Link>
                </div>
              </div>
            </BasicImage>
          </div>
        </>
      ) : null}
    </>
  );
};

export default CurrentImage;
