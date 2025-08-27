import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";

/**
 * Compact animated graphic simulating the lead discovery pipeline.
 * - Header row: rounded progress bar + step counter + "Completed"
 * - Subsequent rows: step titles that animate upward and fade when completed
 *
 * Visual goals requested by user:
 * - Minimal size, centered; neutral grayscale with subtle green success badges
 * - Thin borders, slightly rounded corners; loader track gray, fill dark gray
 */
export default function LeadDiscoveryGraphic() {
  const steps = useMemo(
    () => [
      "Finding subreddits",
      "Scanning threads",
      "Analyzing intent",
      "Drafting replies",
      "Preparing export",
    ],
    []
  );

  const totalSteps = steps.length;
  const [currentIndex, setCurrentIndex] = useState(0); // 0..totalSteps
  const [inProgress, setInProgress] = useState(false);
  const intervalRef = useRef(null);
  const [windowStart, setWindowStart] = useState(0); // start index for visible window
  const [shiftY, setShiftY] = useState(0); // animated translate for smooth scroll
  const [rowHeight, setRowHeight] = useState(0);
  const firstRowRef = useRef(null);
  const [cycle, setCycle] = useState(0); // forces remount after reset
  const [resetting, setResetting] = useState(false);
  const FALLBACK_ROW_H = 36; // ensures first scroll has a stable row height
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  // Intersection observer to start animation when component comes into view
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          setInProgress(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isVisible]);

  // Trigger reset phase when reaching the end, but hold briefly with tasks visible
  useEffect(() => {
    if (!inProgress || resetting) return;
    if (currentIndex >= totalSteps) {
      const holdId = setTimeout(() => setResetting(true), 700);
      return () => clearTimeout(holdId);
    }
  }, [currentIndex, inProgress, totalSteps, resetting]);

  // During normal operation, advance steps on a timer
  useEffect(() => {
    if (!inProgress || resetting) return;
    if (currentIndex < totalSteps) {
      const id = setTimeout(() => setCurrentIndex((i) => i + 1), 1400);
      return () => clearTimeout(id);
    }
  }, [currentIndex, inProgress, resetting, totalSteps]);

  // When resetting is true, fade out, reset indices, then hold briefly before fading back in
  useEffect(() => {
    if (!resetting) return;
    const outId = setTimeout(() => {
      setWindowStart(0);
      setShiftY(0);
      setCurrentIndex(0);
      setCycle((c) => c + 1);
      const holdId = setTimeout(() => {
        setResetting(false);
      }, 250);
      return () => clearTimeout(holdId);
    }, 650);
    return () => clearTimeout(outId);
  }, [resetting]);

  const completed = Math.min(currentIndex, totalSteps);
  const baseProgress = completed / totalSteps; // 0..1
  const displayCompleted = resetting ? 0 : completed;
  const displayProgress = resetting ? 0 : baseProgress;

  // Determine desired window start (keep two completed rows visible at top)
  const desiredStart = Math.max(0, completed - 2);

  // Smoothly scroll list upward when desiredStart advances
  useEffect(() => {
    if (resetting) return;
    const stepHeight = rowHeight || FALLBACK_ROW_H;
    if (desiredStart > windowStart && stepHeight > 0) {
      setShiftY(-stepHeight);
      const id = setTimeout(() => {
        setWindowStart((s) => s + 1);
        setShiftY(0);
      }, 500);
      return () => clearTimeout(id);
    }
  }, [desiredStart, windowStart, rowHeight, resetting]);

  // Measure row height for accurate viewport height
  useEffect(() => {
    if (firstRowRef.current) {
      const h = Math.round(firstRowRef.current.getBoundingClientRect().height);
      if (h && h !== rowHeight) setRowHeight(h);
    }
  });

  // Visible window shows up to 4 rows (last is preview beneath the bottom fade)
  const startIndex = windowStart;
  const maxCount = 4;
  const visibleSteps = steps
    .map((label, idx) => ({ label, idx }))
    .slice(startIndex, startIndex + maxCount);

  return (
    <div className="w-full flex items-center justify-center" ref={containerRef}>
      <div className="w-[320px] sm:w-[360px]">
        {/* Header / Progress Row (never fades; shows 0/5 during reset) */}
        <div className="grid grid-cols-[60%_auto_auto] gap-3 items-center border border-gray-200 rounded-md p-3 bg-white">
          {/* Progress Track */}
          <div className="w-full">
            <div className="h-2 rounded-full bg-gray-200 overflow-hidden border border-gray-300/70">
              <motion.div
                className="h-full bg-gray-800"
                animate={{ width: `${displayProgress * 100}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ width: `${displayProgress * 100}%` }}
              />
            </div>
          </div>
          {/* Step Counter */}
          <div className="text-[12px] text-gray-500 tabular-nums select-none justify-self-center text-center">
            {displayCompleted}/{totalSteps}
          </div>
          {/* Completed label */}
          <div className="text-[12px] text-gray-500 select-none justify-self-center text-center">
            Completed
          </div>
        </div>

        {/* Steps List (slightly narrower than header). Only dividers between rows. */}
        <div
          className="mt-3 mx-auto w-[92%] rounded-md bg-white overflow-hidden relative"
          style={{ height: (rowHeight || FALLBACK_ROW_H) * 3 - 6 }}
        >
          {/* Fade masks to imply rows sliding behind (top) and preview (bottom) */}
          <div
            className="pointer-events-none absolute -top-1 left-0 right-0 z-10"
            style={{
              height: rowHeight
                ? Math.max(18, Math.round(rowHeight * 0.75))
                : 24,
              background:
                "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0.5) 35%, rgba(255,255,255,0) 96%)",
            }}
          />
          <div
            className="pointer-events-none absolute -bottom-1 left-0 right-0 z-10"
            style={{
              height: rowHeight
                ? Math.max(34, Math.round(rowHeight * 1.25))
                : 44,
              background:
                "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.65) 28%, rgba(255,255,255,0) 90%)",
            }}
          />
          <div className="relative h-full">
            <AnimatePresence initial={false} mode="wait">
              {visibleSteps.length === 0 ? (
                <motion.div
                  key="done-placeholder"
                  className="px-3 py-2 text-[12px] text-gray-500 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Ready for next scan
                </motion.div>
              ) : (
                <motion.div
                  className="divide-y divide-gray-200 will-change-transform"
                  layout
                  animate={{ y: shiftY }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  key={`rows-${cycle}`}
                >
                  {visibleSteps.map(({ label, idx }, mapIndex) => (
                    <motion.div
                      key={label}
                      className="flex items-center justify-between px-3 py-2 bg-white"
                      style={{ height: rowHeight || FALLBACK_ROW_H }}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: resetting ? 0 : 1, y: 0 }}
                      exit={{ opacity: 0, y: -24 }}
                      transition={{
                        duration: 0.5,
                        ease: "easeOut",
                        delay: resetting
                          ? (visibleSteps.length - 1 - mapIndex) * 0.08
                          : 0,
                      }}
                      layout
                      ref={mapIndex === 0 ? firstRowRef : undefined}
                    >
                      {/* Status Circle */}
                      <div className="w-5 h-5 mr-3 flex items-center justify-center">
                        {idx < completed ? (
                          <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-gray-800" />
                          </div>
                        ) : idx === completed ? (
                          <div className="w-5 h-5 rounded-full border border-gray-300" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-gray-300" />
                        )}
                      </div>

                      {/* Label */}
                      <div className="flex-1 text-[13px] text-gray-700 truncate pr-3 select-none">
                        {label}
                      </div>

                      {/* Chevron */}
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
