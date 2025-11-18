import { useEffect, useState } from "react";

export const useBreakpoints = () => {
  const [isSm, setIsSm] = useState(false);
  const [isMd, setIsMd] = useState(false);
  const [isLg, setIsLg] = useState(false);

  const updateSize = () => {
    const width = window.innerWidth;
    setIsSm(width < 768); // sm: 640px
    setIsMd(width >= 768 && width < 1024); // md: 768px
    setIsLg(width >= 1024); // lg: 1024px+
  };

  useEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return { isSm, isMd, isLg };
};
