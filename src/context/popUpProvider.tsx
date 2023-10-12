import Alert, { AlertProps } from "@/components/common/Alert";
import Confirm, { ConfirmProps } from "@/components/common/Confirm";
import { createContext, useState } from "react";

type Type = {
  confirm: (title: string, content: string) => Promise<boolean>;
  alert: (title: string, content: string) => Promise<boolean>;
};

export const PopUpContext = createContext<Type>({
  confirm: () => new Promise((_, reject) => reject()),
  alert: () => new Promise((_, reject) => reject()),
});

export const PopUpProvider = ({ children }: { children: React.ReactNode }) => {
  const [type, setType] = useState("");
  const [confirmState, setConfirmState] = useState<ConfirmProps>();
  const [alertState, setAlertState] = useState<AlertProps>();

  const confirm = (title: string, content: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setType("confirm");
      setConfirmState({
        title: title,
        content: content,
        onClickOK: () => {
          setConfirmState(undefined);
          resolve(true);
        },
        onClickCancel: () => {
          setConfirmState(undefined);
          resolve(false);
        },
      });
    });
  };

  const alert = (title: string, content: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setType("alert");
      setAlertState({
        title: title,
        content: content,
      });
      setTimeout(() => {
        setAlertState(undefined);
        resolve(true);
      }, 3000);
    });
  };

  const popUpRender = () => {
    switch (type) {
      case "confirm": {
        if (!confirmState) return;

        return (
          <Confirm
            title={confirmState.title}
            content={confirmState.content}
            onClickOK={confirmState.onClickOK}
            onClickCancel={confirmState.onClickCancel}
          />
        );
      }
      case "alert": {
        if (!alertState) return;

        return (
          <Alert title={alertState.title} content={alertState.content} onClickOK={alertState.onClickOK} />
        );
      }
      default:
        return null;
    }
  };

  return (
    <PopUpContext.Provider value={{ confirm, alert }}>
      {children}
      {popUpRender()}
    </PopUpContext.Provider>
  );
};
