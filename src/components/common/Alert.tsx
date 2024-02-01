export interface AlertProps {
  title: string;
  content: string;
}

const Alert = ({ title, content }: AlertProps) => {
  return (
    <div className="text-center break-all p-[15px]">
      <div className="text-red-500 text-[17px] font-semibold">{title}</div>
      <div className="text-[14px] text-neutral-400 mt-[5px]">{content}</div>
    </div>
  );
};

export default Alert;
