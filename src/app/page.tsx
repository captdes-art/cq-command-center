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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Weather + Marine: Side-by-side on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <WeatherWidget />
          <MarineWidget />
        </div>

        {/* Apps & Tools Grid */}
        <AppGrid />

        {/* NYS Fishing Regulations */}
        <RegulationsCard />

        {/* Local Resources Directory */}
        <LocalResources />

        {/* Quick Links */}
        <QuickLinks />
      </main>

      {/* Footer */}
      <footer className="border-t border-navy-700 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 text-center">
          <p className="text-xs text-slate-600">
            CQ Command Center &middot; Celtic Quest Fishing &middot; Port
            Jefferson, NY
          </p>
        </div>
      </footer>
    </div>
  );
}
