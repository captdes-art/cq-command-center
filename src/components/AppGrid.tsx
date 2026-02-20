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
      <h2 className="text-[15px] font-bold text-gray-900 mb-4">
        Apps & Tools
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {appsData.apps.map((app) => {
          const Icon = iconMap[app.icon] || Globe;
          return (
            <a
              key={app.name}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-[14px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-5 hover:bg-blue-50 hover:shadow-[0_8px_28px_rgba(0,0,0,0.09)] transition-all duration-200 hover:-translate-y-[3px] cursor-pointer block"
            >
              <div
                className="w-[46px] h-[46px] rounded-xl flex items-center justify-center mb-3.5"
                style={{ backgroundColor: `${app.accentColor}1F` }}
              >
                <Icon
                  className="w-[22px] h-[22px]"
                  style={{ color: app.accentColor }}
                />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-0.5">
                {app.name}
              </h3>
              <p className="text-xs text-gray-400">{app.description}</p>
            </a>
          );
        })}
      </div>
    </div>
  );
}
