import { Icon } from "@iconify/react";

const Loading = () => {
  return (
    <div>
      <Icon icon="line-md:loading-twotone-loop" />
      <div className="flex">
        <div>로</div>
        <div>딩</div>
      </div>
    </div>
  );
};

export default Loading;
