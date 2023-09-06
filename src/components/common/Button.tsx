interface ButtonProps {
  text: string;
  style: string;
  onClick: () => {};
  disabled?: boolean;
}

const Button = ({ text, style, onClick, disabled = false }: ButtonProps) => {
  return (
    <button className={style} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
};

export default Button;
