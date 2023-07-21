interface TitleProps {
  title: string;
}

const Title = ({ title }: TitleProps) => {
  return <div className="text-[24px] text-bc px-[10px] py-[7px] mb-[40px] border-b border-bs">{title}</div>;
};

export default Title;
