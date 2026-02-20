import { Fish, ExternalLink, AlertCircle } from "lucide-react";
import regulationsData from "@/data/regulations.json";

export default function RegulationsCard() {
  return (
    <div
      className="animate-fade-in-up"
      style={{ animationDelay: "0.2s" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          NYS Saltwater Fishing Regulations
        </h2>
        <a
          href={regulationsData.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1"
        >
          Full DEC Regulations <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {regulationsData.species.map((species) => (
          <div
            key={species.name}
            className="bg-card rounded-xl border border-border p-4 hover:border-teal-600/30 transition-colors"
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
  );
}
