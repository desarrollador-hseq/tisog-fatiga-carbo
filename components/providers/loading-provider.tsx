"use client";

import { Roboto } from "next/font/google";
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { LoaderFullpage } from "../loader-fullpage";
import { useSession } from "next-auth/react";
import { Role, User } from "@prisma/client";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

interface LoadingProps {
  setLoadingApp: Dispatch<SetStateAction<boolean | undefined>>;
  loadingApp: boolean | undefined;
  userRole: Role | undefined;
}

interface Props {
  children: ReactNode;
}

export const LoadingContext = createContext<LoadingProps>({
  setLoadingApp: () => {},
  loadingApp: false,
  userRole: undefined,
});

export const LoadingProvider = ({ children }: Props) => {
  const [loadingApp, setLoadingApp] = useState<boolean | undefined>(true);
  const [userRole, setUserRole] = useState<Role | undefined>();

  const { data: session, status, update } = useSession();
  useEffect(() => {
    const interval = setInterval(() => update(), 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, [update]);

  useEffect(() => {
    async function fetchUserAndCompany() {
      if (status === "authenticated") {
        setUserRole(session.user.role as Role);
      }
    }

    if (status !== "loading" && status !== "unauthenticated") {
      fetchUserAndCompany();
    }
  }, [status]);

  useEffect(() => {
    try {
      setLoadingApp(false);
    } catch (error) {
      setLoadingApp(false);
    } finally {
      setLoadingApp(false);
    }
  }, []);

  return (
    <LoadingContext.Provider value={{ setLoadingApp, loadingApp, userRole }}>
      <body
        className={cn(roboto.className, loadingApp && "overflow-hidden")}
        style={{
          background: `url('/blob-scene.svg'), linear-gradient(180deg, rgba(3, 120, 124, 0.2) 0%, rgba(3, 120, 124, 0.8) 100%)`, // Gradiente lineal + imagen de fondo
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          height: "100vh",
          overflow: loadingApp ? "hidden" : "auto",
        }}
      >
        {loadingApp && <LoaderFullpage />}
        {children}
      </body>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
