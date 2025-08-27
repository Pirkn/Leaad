import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function ComplianceGraphic() {
  const items = [
    "Follow subreddit rules",
    "Avoid automation",
    "Provide value first",
    "Respect pacing",
    "Transparent intent",
  ];
  const [done, setDone] = useState(0);
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
      () => setDone((d) => (d + 1) % (items.length + 1)),
      1100
    );
    return () => clearInterval(id);
  }, [isVisible, items.length]);

  return (
    <div ref={ref} className="w-full flex items-center justify-center">
      <div className="w-[320px] sm:w-[360px]">
        <div className="border border-gray-200 rounded-md p-3 bg-white">
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <div className="w-5 h-5 mr-2 rounded-full bg-gray-100 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-gray-700" />
            </div>
            Compliance Checklist
          </div>
          <div className="divide-y divide-gray-200">
            {items.map((t, i) => {
              const isNewlyCompleted = i === done - 1 && done > 0;
              const isCompleted = i < done;
              return (
                <motion.div
                  key={t}
                  className="flex items-center justify-between py-2"
                  initial={false}
                  animate={{ scale: isNewlyCompleted ? [1, 1.035, 1] : 1 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <motion.div
                    animate={{
                      backgroundColor: isCompleted ? "#dcfce7" : "#ffffff",
                      borderColor: isCompleted ? "#22c55e" : "#d1d5db",
                    }}
                    transition={{ duration: 0.35 }}
                    className="w-5 h-5 rounded-full border flex items-center justify-center mr-2"
                  >
                    {isCompleted ? (
                      <motion.div
                        className="w-2.5 h-2.5 rounded-full bg-gray-800"
                        initial={false}
                        animate={{
                          scale: isNewlyCompleted ? [0.7, 1.15, 1] : 1,
                        }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                      />
                    ) : null}
                  </motion.div>
                  <div className="flex-1 text-[13px] text-gray-700">{t}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
