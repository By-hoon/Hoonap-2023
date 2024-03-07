import { ALERT_TITLE, ALERT_CONTENT } from "./constants";

const Alerts = (code: string) => {
  if (code === "auth/email-already-in-use")
    return { ALERT_TITLE: ALERT_TITLE.ID, ALERT_CONTENT: ALERT_CONTENT.INVALID_ID };
  if (code === "auth/user-not-found")
    return { ALERT_TITLE: ALERT_TITLE.ID, ALERT_CONTENT: ALERT_CONTENT.USER_NOT_FOUND };
  if (code === "auth/invalid-email")
    return { ALERT_TITLE: ALERT_TITLE.ID, ALERT_CONTENT: ALERT_CONTENT.RECONFIRM_EMAIL };
  if (code === "auth/weak-password")
    return { ALERT_TITLE: ALERT_TITLE.PASSWORD, ALERT_CONTENT: ALERT_CONTENT.RECONFIRM_PASSWORD };
  if (code === "auth/wrong-password")
    return { ALERT_TITLE: ALERT_TITLE.PASSWORD, ALERT_CONTENT: ALERT_CONTENT.WRONG_PASSWORD };
  if (code === "auth/too-many-requests")
    return { ALERT_TITLE: ALERT_TITLE.SERVER, ALERT_CONTENT: ALERT_CONTENT.TRY_AGAIN };

  return { ALERT_TITLE: ALERT_TITLE.UNKNOWN, ALERT_CONTENT: ALERT_CONTENT.UNKNOWN };
};

export default Alerts;
