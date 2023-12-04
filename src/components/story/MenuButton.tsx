interface MenuButtonProps {
  isShow?: boolean;
  name: string;
  style?: string;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}

const MenuButton = ({ isShow = true, name, style = "", onClick }: MenuButtonProps) => {
  if (!isShow) return <></>;

  return (
    <div
      className={`cursor-pointer flex justify-center items-center m-[5px] p-[5px] ${style}`}
      onClick={onClick}
    >
      {name}
    </div>
  );
};

export default MenuButton;
