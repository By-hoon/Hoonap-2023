export interface AlertProps {
  title: string;
  content: string;
}

const Alert = ({ title, content }: AlertProps) => {
  return (
    <div className="text-center break-all p-[15px]">
      <div className="text-red-500 text-[16px] mobile:text-[14px] font-semibold break-keep">{title}</div>
      <div className="text-[14px] mobile:text-[12px] text-neutral-400 mt-[5px] break-keep">{content}</div>
    </div>
  );
};

export default Alert;
