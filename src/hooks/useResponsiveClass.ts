import { useEffect, useState } from "react";

const useResponsiveClass = () => {
  const [responsiveClass, setResponsiveClass] = useState("");

  useEffect(() => {
    const updateClass = () => {
      if (window.innerWidth <= 600) {
        setResponsiveClass("small-screen");
      } else if (window.innerWidth <= 1024) {
        setResponsiveClass("medium-screen");
      } else {
        setResponsiveClass("large-screen");
      }
    };

    updateClass();
    window.addEventListener("resize", updateClass);
    return () => window.removeEventListener("resize", updateClass);
  }, []);

  return responsiveClass;
};

export default useResponsiveClass;
