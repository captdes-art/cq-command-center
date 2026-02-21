import {
  TrendingUp,
  Ship,
  Thermometer,
} from "lucide-react";

const links = [
  {
    name: "Tide Charts — Bridgeport",
    url: "https://tidesandcurrents.noaa.gov/noaatidepredictions.html?id=8467150",
    icon: TrendingUp,
  },
  {
    name: "PJ Ferry Schedule",
    url: "https://www.88844ferry.com/schedule",
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
    <div className="animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
      <h2 className="text-[15px] font-bold text-gray-900 mb-4">
        Quick Links
      </h2>

      <div className="flex flex-wrap gap-2.5">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.05)] px-5 py-2.5 text-[13px] font-medium text-gray-500 hover:bg-blue-50 hover:text-blue-800 hover:shadow-[0_4px_14px_rgba(30,64,175,0.1)] transition-all duration-200 cursor-pointer"
            >
              <Icon className="w-4 h-4 text-gray-400" />
              {link.name}
            </a>
          );
        })}
      </div>
    </div>
  );
}
