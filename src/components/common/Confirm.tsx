import { useEffect } from "react";

export interface ConfirmProps {
  title: string;
  content: string;
  onClickOK: () => void;
  onClickCancel: () => void;
}

const Confirm = ({ title, content, onClickOK, onClickCancel }: ConfirmProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;

      onClickCancel();
    };

    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClickCancel]);

  return (
    <div
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[300px] bg-white shadow-basic rounded-[10px] overflow-hidden z-[200]"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="text-center break-all p-[25px]">
        <div className="text-[16px] mobile:text-[14px] font-semibold">{title}</div>
        <div className="text-[14px] mobile:text-[12px] text-neutral-400 mt-[5px]">{content}</div>
      </div>
      <div className="flex text-center text-[16px]">
        <button
          className="cursor-pointer w-[50%] bg-zinc-200 py-[7px]"
          onClick={(e) => {
            e.stopPropagation();
            onClickCancel();
          }}
        >
          취소
        </button>
        <button
          className="cursor-pointer w-[50%] text-white bg-bc py-[7px]"
          autoFocus
          onClick={(e) => {
            e.stopPropagation();
            onClickOK();
          }}
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default Confirm;
