// hooks/usePwaInstall.ts
import { useEffect, useState } from "react";

export const usePwaInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault(); // stop browser default prompt
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const promptInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      console.log("User response to install:", choice.outcome);
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  return { isInstallable, promptInstall };
};
