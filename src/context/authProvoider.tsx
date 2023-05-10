import { useState, useEffect, useContext, createContext, useMemo, Dispatch } from "react";
import { getAuth, User } from "firebase/auth";
import nookies from "nookies";
import firebase_app from "@/firebase/config";

const AuthContext = createContext<{ user: User | null }>({
  user: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userState, setUserState] = useState<User | null>(null);

  useEffect(() => {
    return getAuth(firebase_app).onIdTokenChanged(async (user) => {
      if (!user) {
        setUserState(null);
        nookies.set(null, "token", "", { path: "/" });
        return;
      }

      setUserState(user);
      const token = await user.getIdToken();
      nookies.destroy(null, "token");
      nookies.set(null, "token", token, { path: "/" });
    });
  }, []);

  useEffect(() => {
    const refreshToken = setInterval(async () => {
      const { currentUser } = getAuth();
      if (currentUser) await currentUser.getIdToken(true);
    }, 10 * 60 * 1000);

    return () => clearInterval(refreshToken);
  }, []);

  const user = useMemo(
    () => ({
      user: userState,
    }),
    [userState]
  );

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
