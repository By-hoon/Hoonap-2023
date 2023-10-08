import Confirm, { ConfirmProps } from "@/components/common/Confirm";
import { createContext, useState } from "react";

type Type = {
  confirm: (title: string, content: string) => Promise<boolean>;
};

export const ConfirmContext = createContext<Type>({
  confirm: () => new Promise((_, reject) => reject()),
});

export const PopUpProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<ConfirmProps>();

  const confirm = (title: string, content: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        title: title,
        content: content,
        onClickOK: () => {
          setState(undefined);
          resolve(true);
        },
        onClickCancel: () => {
          setState(undefined);
          resolve(false);
        },
      });
    });
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {state && (
        <Confirm
          title={state.title}
          content={state.content}
          onClickOK={state.onClickOK}
          onClickCancel={state.onClickCancel}
        />
      )}
    </ConfirmContext.Provider>
  );
};
