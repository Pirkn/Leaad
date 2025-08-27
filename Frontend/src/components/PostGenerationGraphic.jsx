import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, MessageSquareText } from "lucide-react";

export default function PostGenerationGraphic() {
  const lines = useMemo(
    () => [
      "Understanding thread context...",
      "Drafting helpful opener...",
      "Adding product insight...",
      "Polishing tone and clarity...",
      "Ready to post",
    ],
    []
  );

  const [idx, setIdx] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  const [clickAnim, setClickAnim] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [cycleDelay, setCycleDelay] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setIsVisible(true),
      { threshold: 0.3 }
    );
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    // Simulate button click once on visible
    setTimeout(() => {
      setClickAnim(true);
      setGenerating(true);
    }, 400);
    // Progress through statuses, then show result
    const timers = [];
    lines.forEach((_, i) => {
      timers.push(setTimeout(() => setIdx(i), 1100 * (i + 1)));
    });
    timers.push(
      setTimeout(() => {
        setShowResult(true);
        setGenerating(false);
        setCycleDelay(true);
        // Hold the result for a few seconds, then restart cycle
        setTimeout(() => {
          setShowResult(false);
          setIdx(0);
          setClickAnim(false);
          setCycleDelay(false);
        }, 2600);
      }, 1100 * (lines.length + 1))
    );
    return () => timers.forEach(clearTimeout);
  }, [isVisible, lines.length]);

  return (
    <div ref={containerRef} className="w-full flex items-center justify-center">
      <div className="w-[320px] sm:w-[360px]">
        <div className="border border-gray-200 rounded-md p-3 bg-white">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <div className="w-5 h-5 mr-2 rounded-full bg-green-50 flex items-center justify-center">
              <MessageSquareText className="w-3.5 h-3.5 text-gray-700" />
            </div>
            <div className="flex-1">AI Post Generator</div>
            <motion.div
              className="px-2 py-1 rounded-md text-[11px] bg-gray-200 text-gray-700"
              initial={false}
              animate={{ scale: clickAnim ? [1, 0.96, 1] : 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              Generating...
            </motion.div>
          </div>
          {/* spacing divider */}
          <div className="w-full h-0.5 rounded-full bg-gray-100 mb-2" />
          <div className="relative h-24 rounded-md border border-gray-200 bg-white overflow-hidden">
            <div className="absolute inset-0 p-3">
              {!showResult ? (
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="text-[13px] text-gray-700"
                  >
                    {lines[idx]}
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="text-[13px] text-gray-700 leading-5">
                  Hey folks — here’s a quick breakdown of how we shipped our MVP
                  in 7 days, validated demand, and got our first 200 users.
                  Happy to share the exact stack and what we’d do differently
                  next time.
                </div>
              )}
            </div>
            <div
              className="pointer-events-none absolute -bottom-1 left-0 right-0 z-10"
              style={{
                height: 24,
                background:
                  "linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0))",
              }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>Natural, context-aware</span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
