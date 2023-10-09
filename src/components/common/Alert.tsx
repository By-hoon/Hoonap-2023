export interface AlertProps {
  title: string;
  content: string;
  onClickOK?: () => void;
}

const Alert = ({ title, content, onClickOK }: AlertProps) => {
  return (
    <div>
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
