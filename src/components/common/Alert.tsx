export interface AlertProps {
  title: string;
  content: string;
  onClickOK?: () => void;
}

const Alert = ({ title, content, onClickOK }: AlertProps) => {
  return (
    <div className="absolute top-[10px] left-1/2 transform -translate-x-1/2 border z-[200]">
      <div>{title}</div>
      <div>{content}</div>
      {onClickOK ? (
        <div>
          <button onClick={onClickOK}>확인</button>
        </div>
      ) : null}
    </div>
  );
};

export default Alert;
