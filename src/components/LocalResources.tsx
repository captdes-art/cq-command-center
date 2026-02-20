"use client";

import { useState } from "react";
import {
  ChevronDown,
  Phone,
  Globe,
  UtensilsCrossed,
  Hotel,
  Ship,
  Anchor,
  Car,
} from "lucide-react";
import resourcesData from "@/data/local-resources.json";

const categoryIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  UtensilsCrossed,
  Hotel,
  Ship,
  Anchor,
  Car,
};

export default function LocalResources() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Local Resources Directory
      </h2>

      <div className="space-y-2">
        {resourcesData.categories.map((category) => {
          const isOpen = openCategory === category.name;
          const Icon = categoryIcons[category.icon] || Globe;

          return (
            <div
              key={category.name}
              className="bg-white rounded-[14px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenCategory(isOpen ? null : category.name)
                }
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-semibold text-gray-900">
                    {category.name}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {category.businesses.length}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="border-t border-gray-100 px-4 pb-4">
                  <div className="space-y-3 pt-3">
                    {category.businesses.map((biz) => (
                      <div
                        key={biz.name}
                        className="flex items-start justify-between p-3 rounded-lg bg-gray-50"
                      >
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {biz.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {biz.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-4">
                          {biz.phone && (
                            <a
                              href={`tel:${biz.phone.replace(/\D/g, "")}`}
                              className="text-blue-500 hover:text-blue-700 transition-colors p-1.5 rounded-md hover:bg-blue-50"
                              title={biz.phone}
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                          )}
                          {biz.website && (
                            <a
                              href={biz.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700 transition-colors p-1.5 rounded-md hover:bg-blue-50"
                              title="Website"
                            >
                              <Globe className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
