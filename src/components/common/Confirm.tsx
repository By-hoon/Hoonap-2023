export interface ConfirmProps {
  title: string;
  content: string;
  onClickOK: () => void;
  onClickCancel: () => void;
}

const Confirm = ({ title, content, onClickOK, onClickCancel }: ConfirmProps) => {
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[300px] bg-white rounded-[10px] overflow-hidden z-[200]">
      <div className="text-center break-keep p-[25px]">
        <div className="text-[17px] font-semibold">{title}</div>
        <div className="text-[14px] text-neutral-400 mt-[5px]">{content}</div>
      </div>
      <div className="flex text-center text-[16px]">
        <div className="cursor-pointer w-[50%] bg-zinc-200 py-[7px]" onClick={onClickCancel}>
          취소
        </div>
        <div className="cursor-pointer w-[50%] text-white bg-bc py-[7px]" onClick={onClickOK}>
          확인
        </div>
      </div>
    </div>
  );
};

export default Confirm;
