interface TitleProps {
  title: string;
}

const Title = ({ title }: TitleProps) => {
  return <div className="text-[22px] text-bcd">{title}</div>;
};

export default Title;
