export interface AlertProps {
  title: string;
  content: string;
}

const Alert = ({ title, content }: AlertProps) => {
  return (
    <div className="fixed top-[20px] left-1/2 transform -translate-x-1/2 max-w-[300px] bg-red-100 rounded-[10px] z-[200]">
      <div className="text-center break-all p-[15px]">
        <div className="text-red-500 text-[17px] font-semibold">{title}</div>
        <div className="text-[14px] text-neutral-400 mt-[5px]">{content}</div>
      </div>
    </div>
  );
};

export default Alert;
