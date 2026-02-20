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
      <div className="bg-white rounded-[14px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden">
        {/* Collapsible header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Fish className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              NYS Saltwater Fishing Regulations
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {regulationsData.species.length} species
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={regulationsData.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1"
            >
              Full DEC Regulations <ExternalLink className="w-3 h-3" />
            </a>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {/* Expandable species cards */}
        {isOpen && (
          <div className="border-t border-gray-100 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {regulationsData.species.map((species) => (
                <div
                  key={species.name}
                  className="bg-gray-50 rounded-xl p-4 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Fish className="w-5 h-5 text-blue-500" />
                    <h3 className="text-sm font-bold text-gray-900">
                      {species.name}
                    </h3>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Size</span>
                      <span className="text-gray-700 font-medium text-right">
                        {species.slotSize}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Season</span>
                      <span className="text-gray-700 font-medium text-right max-w-[65%]">
                        {species.season}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Bag Limit</span>
                      <span className="text-gray-700 font-medium text-right max-w-[65%]">
                        {species.bagLimit}
                      </span>
                    </div>

                    {species.notes && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <div className="flex items-start gap-1.5">
                          <AlertCircle className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                          <p className="text-amber-600 text-[11px] leading-relaxed">
                            {species.notes}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-400 mt-3 text-center">
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
