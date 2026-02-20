import Header from "@/components/Header";
import WeatherWidget from "@/components/WeatherWidget";
import MarineWidget from "@/components/MarineWidget";
import AppGrid from "@/components/AppGrid";
import RegulationsCard from "@/components/RegulationsCard";
import LocalResources from "@/components/LocalResources";
import QuickLinks from "@/components/QuickLinks";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Content overlaps the hero header */}
      <main
        className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10"
        style={{ marginTop: "-64px", paddingBottom: "60px" }}
      >
        <div className="space-y-7">
          {/* Apps & Tools Grid — most important, always on top */}
          <AppGrid />

          {/* Quick Links */}
          <QuickLinks />

          {/* Weather + Marine: Side-by-side on desktop, stacked on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <WeatherWidget />
            <MarineWidget />
          </div>

          {/* NYS Fishing Regulations — collapsible */}
          <RegulationsCard />

          {/* Local Resources Directory */}
          <LocalResources />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 text-center">
          <p className="text-xs text-slate-400">
            CQ Command Center &middot; Celtic Quest Fishing &middot; Port
            Jefferson, NY
          </p>
        </div>
      </footer>
    </div>
  );
}
