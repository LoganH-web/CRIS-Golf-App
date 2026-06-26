"use client";

/**
 * FaqAccordion — client component for the expandable FAQ list.
 *
 * Receives the FAQ items as a prop (passed from the server-rendered FAQ page
 * after loading the dictionary). This keeps server/client boundary clean and
 * avoids shipping the dictionary to the client.
 *
 * Each item is independently expandable. Only one item open at a time would
 * add unnecessary UX friction for a FAQ list, so multiple can be open.
 */

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps): React.ReactElement {
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set());

  function toggleItem(index: number) {
    setOpenIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  return (
    <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white overflow-hidden">
      {items.map((item, index) => {
        const isOpen = openIndexes.has(index);
        const itemId = `faq-item-${index}`;
        const answerId = `faq-answer-${index}`;

        return (
          <div key={index}>
            <button
              type="button"
              onClick={() => toggleItem(index)}
              aria-expanded={isOpen}
              aria-controls={answerId}
              id={itemId}
              className="flex w-full items-start justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-slate-50 active:bg-slate-100"
            >
              <span className="text-sm font-semibold text-slate-800">
                {item.question}
              </span>
              <Icon
                name="chevron-down"
                size={16}
                className={`mt-0.5 shrink-0 text-slate-400 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div
                id={answerId}
                role="region"
                aria-labelledby={itemId}
                className="px-4 pb-4"
              >
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
