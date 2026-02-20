import {
  CalendarCheck,
  FileText,
  Globe,
  Instagram,
  Phone,
  Bot,
  Mail,
  HardDrive,
  MessageSquare,
  CreditCard,
  ExternalLink,
} from "lucide-react";
import appsData from "@/data/apps.json";

const iconMap: Record<
  string,
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
> = {
  CalendarCheck,
  FileText,
  Facebook: Globe,
  Instagram,
  Phone,
  Bot,
  Mail,
  HardDrive,
  MessageSquare,
  CreditCard,
};

export default function AppGrid() {
  return (
    <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
        Apps & Tools
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {appsData.apps.map((app) => {
          const Icon = iconMap[app.icon] || Globe;
          return (
            <a
              key={app.name}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card rounded-xl border border-border p-4 hover:bg-card-hover hover:border-teal-600/50 transition-all duration-200 hover:scale-[1.02]"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${app.accentColor}20` }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: app.accentColor }}
                  />
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
              </div>
              <h3 className="text-sm font-semibold text-slate-200 mb-0.5">
                {app.name}
              </h3>
              <p className="text-xs text-slate-500">{app.description}</p>
            </a>
          );
        })}
      </div>
    </div>
  );
}
