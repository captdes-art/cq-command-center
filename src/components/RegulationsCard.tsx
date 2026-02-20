"use client";

import { useState } from "react";
import { Fish, ExternalLink, AlertCircle, ChevronDown } from "lucide-react";
import regulationsData from "@/data/regulations.json";

export default function RegulationsCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="animate-fade-in-up"
      style={{ animationDelay: "0.2s" }}
    >
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {/* Collapsible header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-card-hover transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <Fish className="w-5 h-5 text-teal-400" />
            <span className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
              NYS Saltwater Fishing Regulations
            </span>
            <span className="text-xs text-slate-500 bg-navy-700 px-2 py-0.5 rounded-full">
              {regulationsData.species.length} species
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={regulationsData.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1"
            >
              Full DEC Regulations <ExternalLink className="w-3 h-3" />
            </a>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {/* Expandable species cards */}
        {isOpen && (
          <div className="border-t border-navy-700 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {regulationsData.species.map((species) => (
                <div
                  key={species.name}
                  className="bg-navy-800/50 rounded-xl border border-border p-4 hover:border-teal-600/30 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Fish className="w-5 h-5 text-teal-400" />
                    <h3 className="text-sm font-bold text-slate-200 font-[family-name:var(--font-space-grotesk)]">
                      {species.name}
                    </h3>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Size</span>
                      <span className="text-slate-300 font-medium text-right">
                        {species.slotSize}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Season</span>
                      <span className="text-slate-300 font-medium text-right max-w-[65%]">
                        {species.season}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Bag Limit</span>
                      <span className="text-slate-300 font-medium text-right max-w-[65%]">
                        {species.bagLimit}
                      </span>
                    </div>

                    {species.notes && (
                      <div className="mt-2 pt-2 border-t border-navy-700">
                        <div className="flex items-start gap-1.5">
                          <AlertCircle className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
                          <p className="text-amber-400/80 text-[11px] leading-relaxed">
                            {species.notes}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-600 mt-3 text-center">
              Last updated: {regulationsData.lastUpdated} &middot; Source:{" "}
              {regulationsData.source}. Always verify current regulations before
              fishing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
