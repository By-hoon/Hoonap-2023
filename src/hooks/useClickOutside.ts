import { useEffect, useRef, useState } from "react";

const useClickOutside = () => {
  const [show, setShow] = useState(false);

  const ref = useRef<HTMLInputElement>(null);

  const onClickTarget = () => {
    setShow((target) => !target);
  };

  const onClickOutSide = (e: any) => {
    if (show && ref.current && !ref.current.contains(e.target)) {
      setShow(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", onClickOutSide);
    return () => {
      document.removeEventListener("click", onClickOutSide);
    };
  });

  return { show, ref, onClickTarget };
};

export default useClickOutside;
