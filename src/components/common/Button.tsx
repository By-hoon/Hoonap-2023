interface ButtonProps {
  text: string;
  style: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const Button = ({ text, style, onClick, type, disabled = false }: ButtonProps) => {
  return (
    <button className={style} onClick={onClick} type={type} disabled={disabled}>
      {text}
    </button>
  );
};

export default Button;
