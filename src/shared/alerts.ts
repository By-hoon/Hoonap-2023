import { alertContent, alertTitle } from "./constants";

const Alerts = (code: string) => {
  if (code === "auth/email-already-in-use")
    return { alertTitle: alertTitle.id, alertContent: alertContent.invalidId };
  if (code === "auth/invalid-email")
    return { alertTitle: alertTitle.id, alertContent: alertContent.reconfirmEmail };
  if (code === "auth/weak-password")
    return { alertTitle: alertTitle.password, alertContent: alertContent.reconfirmPassword };
  if (code === "auth/too-many-requests")
    return { alertTitle: alertTitle.server, alertContent: alertContent.tryAgain };

  return { alertTitle: alertTitle.unknown, alertContent: alertContent.unknown };
};

export default Alerts;
