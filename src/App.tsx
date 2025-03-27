import { useEffect, useState } from "react";
import Navbar from "./components/Home/Navbar";
import Cursor from "./components/Cursor";
import Home from "./components/Home/Home";
import { Routes, Route, useLocation } from "react-router";
import WorkShowCase from "./components/Work/WorkShowCase";
import { AnimatePresence } from "framer-motion";
import Loader from "./components/Loader";
import NotSupported from "./components/NotSupported";

const App = () => {
  const [logoColor, setLogoColor] = useState("#fff");
  const [cursorProps, setCursorProps] = useState({
    text: "Scroll",
    isVisible: false,
  });
  const location = useLocation();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isPortrait, setIsPortrait] = useState(
    window.innerHeight > window.innerWidth
  );

  // Handle initial page load and route changes
  useEffect(() => {
    // If it's the first load or a direct navigation
    if (isInitialLoad) {
      // Simulate loading delay (adjust time as needed)
      const loadingTimer = setTimeout(() => {
        setIsLoading(false);
        setIsInitialLoad(false);
      }, 1500); // 1.5 seconds loading screen

      return () => clearTimeout(loadingTimer);
    } else {
      // For subsequent route changes
      setIsLoading(false);
    }
  }, [location.pathname, isInitialLoad]);

  // Detect viewport orientation changes
  useEffect(() => {
    const handleResize = () => {
      const isNowPortrait = window.innerHeight > window.innerWidth;
      if (isNowPortrait !== isPortrait) {
        setIsPortrait(isNowPortrait);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div
      id="parentWrapper"
      className="parentWrapper relative h-screen w-screen"
    >
      {isPortrait ? (
        <NotSupported />
      ) : (
        <>
          <Loader />
          {!isLoading && (
            <Navbar
              pathName={location?.pathname}
              logoColor={logoColor}
              setLogoColor={setLogoColor}
            />
          )}
          <AnimatePresence mode="sync">
            {!isLoading && (
              <Routes location={location} key={location.pathname}>
                <Route
                  path="/"
                  element={
                    <Home
                      setCursorProps={setCursorProps}
                      setLogoColor={setLogoColor}
                    />
                  }
                />
                <Route
                  path="/work"
                  element={<WorkShowCase setLogoColor={setLogoColor} />}
                />
              </Routes>
            )}
          </AnimatePresence>

          {!isLoading && <Cursor cursorProps={cursorProps} />}
        </>
      )}
    </div>
  );
};

export default App;
