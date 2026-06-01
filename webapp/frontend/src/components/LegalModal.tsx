import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { LEGAL_DOCS } from "@/lib/legal";

interface Props {
  docId: string | null;
  onClose: () => void;
}

export default function LegalModal({ docId, onClose }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (docId) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [docId, onClose]);

  const doc = docId ? LEGAL_DOCS[docId] : null;

  return (
    <AnimatePresence>
      {doc && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-2xl max-h-[82vh] overflow-hidden rounded-2xl bg-white dark:bg-ink-900 border border-slate-200 dark:border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {doc.title}
                </h2>
                <p className="font-mono text-[10px] text-slate-400">
                  Last updated: {doc.updated}
                </p>
              </div>
              <button
                onClick={onClose}
                className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 transition"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-5 max-h-[64vh] space-y-5">
              {doc.sections.map((s) => (
                <div key={s.heading}>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {s.heading}
                  </h3>
                  {s.body.map((p, i) => (
                    <p
                      key={i}
                      className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
