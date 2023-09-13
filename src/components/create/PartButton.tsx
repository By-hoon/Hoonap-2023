import { Icon } from "@iconify/react";
import Button from "../common/Button";

interface PartButtonProps {
  name: string;
  icon: string;
  isComplete: boolean;
  onClick: () => void;
}

const PartButton = ({ name, icon, isComplete, onClick }: PartButtonProps) => {
  return (
    <div className="flex w-[100%]">
      <div className="flex font-semibold text-[20px] my-[10px] pl-[10px] hover:text-bc">
        <div className="flex items-center text-[28px] mr-[10px]">
          <Icon icon={icon} />
        </div>
        <Button text={name} style="" onClick={onClick} />
      </div>
      {isComplete ? (
        <div className="flex items-center text-green-500 ml-[10px]">
          <Icon icon="fluent-mdl2:completed-solid" />
        </div>
      ) : null}
    </div>
  );
};

export default PartButton;
