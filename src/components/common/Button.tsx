import { ReactNode } from "react";

interface ButtonProps {
  text: string | ReactNode;
  style: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const Button = ({ text, style, onClick, type = "button", disabled = false }: ButtonProps) => {
  return (
    <button className={style} onClick={onClick} type={type} disabled={disabled}>
      {text}
    </button>
  );
};

export default Button;
