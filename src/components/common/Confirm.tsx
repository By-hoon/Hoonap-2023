export interface ConfirmProps {
  title: string;
  content: string;
  onClickOK: () => void;
  onClickCancel: () => void;
}

const Confirm = ({ title, content, onClickOK, onClickCancel }: ConfirmProps) => {
  return (
    <div className="absolute top-[10px] left-1/2 transform -translate-x-1/2 border z-[200]">
      <div>{title}</div>
      <div>{content}</div>
      <div>
        <button onClick={onClickCancel}>취소</button>
        <button onClick={onClickOK}>확인</button>
      </div>
    </div>
  );
};

export default Confirm;
