import {
  TrendingUp,
  ShieldCheck,
  Ship,
  Thermometer,
  ExternalLink,
} from "lucide-react";

const links = [
  {
    name: "Tide Charts",
    url: "https://tidesandcurrents.noaa.gov/noaatidepredictions.html?id=8516945",
    icon: TrendingUp,
  },
  {
    name: "USCG Boating Safety",
    url: "https://www.uscgboating.org",
    icon: ShieldCheck,
  },
  {
    name: "PJ Ferry Schedule",
    url: "https://www.88844ferry.com/schedules",
    icon: Ship,
  },
  {
    name: "FishTrack / SST Charts",
    url: "https://www.fishtrack.com",
    icon: Thermometer,
  },
];

export default function QuickLinks() {
  return (
    <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
        Quick Links
      </h2>

      <div className="flex flex-wrap gap-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-slate-300 hover:text-teal-400 hover:border-teal-600/50 transition-all duration-200 group"
            >
              <Icon className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-colors" />
              {link.name}
              <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-teal-500 transition-colors" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
