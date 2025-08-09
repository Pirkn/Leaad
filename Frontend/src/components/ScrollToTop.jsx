import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Find the main scrollable container and scroll it to top
    const scrollableContainer = document.querySelector(".flex-1.overflow-auto");
    if (scrollableContainer) {
      scrollableContainer.scrollTo(0, 0);
    }

    // Also scroll the window to top as a fallback
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
