import Alert, { AlertProps } from "@/components/common/Alert";
import Confirm, { ConfirmProps } from "@/components/common/Confirm";
import { createContext, useCallback, useState } from "react";

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
  const [alertsState, setAlertsState] = useState<AlertProps[]>([]);

  const topCalculator = (index: number) => {
    if (index % 3 === 1) return `top-[110px]`;
    if (index % 3 === 2) return `top-[200px]`;

    return `top-[20px]`;
  };

  const confirm = useCallback((title: string, content: string): Promise<boolean> => {
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
  }, []);

  const alert = useCallback((title: string, content: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setType("alert");
      setAlertsState((curState) =>
        curState.concat({
          title,
          content,
        })
      );

      setTimeout(() => {
        setAlertsState((curState) => {
          const newAlertState = [...curState];
          newAlertState.shift();
          return newAlertState;
        });
        resolve(true);
      }, 3000);
    });
  }, []);

  const popUpRender = () => {
    switch (type) {
      case "confirm": {
        if (!confirmState) return;

        return (
          <>
            <div className="!fixed background-shadow z-[150]" onClickCapture={(e) => e.stopPropagation()} />
            <Confirm
              title={confirmState.title}
              content={confirmState.content}
              onClickOK={confirmState.onClickOK}
              onClickCancel={confirmState.onClickCancel}
            />
          </>
        );
      }
      case "alert": {
        if (!alertsState) return;

        return (
          <>
            {alertsState.map((alertState, index) => (
              <div
                key={index}
                //prettier-ignore
                className={`fixed ${topCalculator(index)} left-1/2 transform -translate-x-1/2 max-w-[300px] bg-red-100 rounded-[10px] z-[200]`}
              >
                <Alert title={alertState.title} content={alertState.content} />
              </div>
            ))}
          </>
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
