import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { LayoutGrid } from "lucide-react";

export default function ViralTemplatesGraphic() {
  const templates = useMemo(
    () => [
      "How I validated a niche quickly",
      "We built in public and grew trust",
      "Lessons from 100 user interviews",
      "Breakdown: launch week schedule",
      "Ask Me Anything about pricing",
    ],
    []
  );
  const [active, setActive] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setIsVisible(true),
      { threshold: 0.3 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const id = setInterval(
      () => setActive((a) => (a + 1) % templates.length),
      1200
    );
    return () => clearInterval(id);
  }, [isVisible, templates.length]);

  return (
    <div ref={ref} className="w-full flex items-center justify-center">
      <div className="w-[320px] sm:w-[360px]">
        <div className="border border-gray-200 rounded-md p-3 bg-white">
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <div className="w-5 h-5 mr-2 rounded-full bg-gray-100 flex items-center justify-center">
              <LayoutGrid className="w-3.5 h-3.5 text-gray-700" />
            </div>
            Viral Templates
          </div>
          <div className="grid grid-cols-3 gap-2">
            {templates.map((t, i) => (
              <motion.div
                key={t}
                animate={{
                  scale: i === active ? 1.02 : 1,
                  opacity: i <= active ? 1 : 0.7,
                }}
                transition={{ duration: 0.3 }}
                className={`relative text-[12px] px-2 py-2 border rounded-md text-gray-700 overflow-hidden ${
                  i === active
                    ? "border-gray-400 bg-gray-50"
                    : "border-gray-200"
                }`}
              >
                <div className="relative z-10 pl-2 pr-12 whitespace-nowrap">
                  {t}
                </div>
                {/* right-edge fade so long titles fade out */}
                <div
                  className="pointer-events-none absolute top-0 right-0 h-full w-6 rounded-r-md z-20"
                  style={{
                    background:
                      "linear-gradient(to left, rgba(255,255,255,1) 0%, rgba(255,255,255,0.55) 35%, rgba(255,255,255,0) 75%)",
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
