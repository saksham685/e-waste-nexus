import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CollectionCenter, WasteCategory } from '../types';
import {
  MapPin,
  Search,
  Filter,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Navigation,
  Compass,
  Building,
  Layers
} from 'lucide-react';

export const CentersPage: React.FC<{ onSchedulePickup?: () => void }> = ({ onSchedulePickup }) => {
  const [centers, setCenters] = useState<CollectionCenter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedCenter, setSelectedCenter] = useState<CollectionCenter | null>(null);

  const loadCenters = async () => {
    setLoading(true);
    try {
      const res = await api.centers.getAll();
      if (res.success) {
        setCenters(res.centers);
        if (res.centers.length > 0) setSelectedCenter(res.centers[0]);
      }
    } catch (err) {
      console.error('Failed to load centers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCenters();
  }, []);

  const filteredCenters = centers.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || c.acceptedCategories.includes(categoryFilter as WasteCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-nexus-charcoal via-nexus-card to-nexus-charcoal border border-cyan-500/30">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1 uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Authorized Drop-off Hubs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Collection Center Discovery
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Locate certified municipal vaults, enterprise drop-off depots, and hazardous lithium containment hubs.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-nexus-dark px-3 py-2 rounded-xl border border-slate-800 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>All Centers EPA Licensed</span>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-nexus-charcoal border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by city, center name, or street..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-nexus-dark border border-slate-800 text-xs text-white outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-nexus-dark border border-slate-800 text-xs text-slate-200 outline-none"
          >
            <option value="all">All Accepted Categories</option>
            <option value="Smartphones and Tablets">Smartphones and Tablets</option>
            <option value="Laptops and Computers">Laptops and Computers</option>
            <option value="Batteries and Chargers">Batteries and Chargers</option>
            <option value="Televisions and Monitors">Televisions and Monitors</option>
            <option value="Large Electrical Appliances">Large Electrical Appliances</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Centers List & Interactive Visual Map Representation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Centers Cards List */}
        <div className="lg:col-span-5 space-y-4 max-h-[700px] overflow-y-auto pr-1">
          {loading ? (
            <div className="p-8 text-center text-xs text-nexus-muted">Scanning regional network...</div>
          ) : filteredCenters.length === 0 ? (
            <div className="p-8 text-center text-xs text-nexus-muted bg-nexus-charcoal rounded-xl border border-slate-800">
              No collection centers found matching your search.
            </div>
          ) : (
            filteredCenters.map(center => {
              const isSelected = selectedCenter?.id === center.id;
              return (
                <div
                  key={center.id}
                  onClick={() => setSelectedCenter(center)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-nexus-card border-cyan-500/70 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                      : 'bg-nexus-charcoal/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                        <Building className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{center.name}</h4>
                        <span className="text-[10px] text-cyan-400 font-mono">
                          {center.city}, {center.state}
                        </span>
                      </div>
                    </div>

                    {center.isVerified && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold uppercase bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 mb-3 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{center.address}</span>
                  </p>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{center.operatingHours}</span>
                    </div>
                  </div>

                  {/* Accepted Categories Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
                    {center.acceptedCategories.map((cat, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] bg-nexus-dark text-slate-300 border border-slate-800"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Interactive Visual Map Representation */}
        <div className="lg:col-span-7">
          <div className="p-6 rounded-2xl bg-nexus-charcoal border border-slate-800 space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <Navigation className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase font-mono">
                  Regional Geographic Depository Map
                </h3>
              </div>
              <span className="text-[11px] text-emerald-400 font-mono">Live GPS Telemetry</span>
            </div>

            {/* Custom Interactive Map Canvas Representation */}
            <div className="relative w-full h-80 rounded-xl bg-nexus-dark border border-slate-800/80 overflow-hidden flex items-center justify-center">
              {/* Map grid lines */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'radial-gradient(#06b6d4 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }}
              />

              {/* Geographic hub nodes visual */}
              {centers.map((c, i) => {
                const isSelected = selectedCenter?.id === c.id;
                // Distribute on canvas based on relative coords
                const leftPercent = 25 + (i * 18);
                const topPercent = 30 + ((i % 3) * 22);

                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCenter(c)}
                    style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  >
                    <div className="relative flex items-center justify-center">
                      {isSelected && (
                        <span className="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-cyan-400 opacity-60" />
                      )}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-cyan-400 text-slate-950 scale-125 shadow-[0_0_20px_rgba(6,182,212,0.8)]'
                            : 'bg-nexus-card border-2 border-emerald-400 text-emerald-400 group-hover:scale-110'
                        }`}
                      >
                        <MapPin className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="mt-1 text-[10px] font-mono text-center whitespace-nowrap bg-nexus-dark/90 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                      {c.city}
                    </div>
                  </div>
                );
              })}

              <div className="absolute bottom-3 left-3 text-[10px] text-nexus-muted bg-nexus-dark/80 px-2 py-1 rounded border border-slate-800 font-mono">
                Click map node to focus facility details
              </div>
            </div>

            {/* Selected Center Detailed Profile */}
            {selectedCenter && (
              <div className="p-5 rounded-xl bg-nexus-dark/70 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-base font-bold text-white">{selectedCenter.name}</h4>
                    <p className="text-xs text-slate-400">{selectedCenter.address}, {selectedCenter.city}, {selectedCenter.state} {selectedCenter.postalCode}</p>
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(selectedCenter.address + ', ' + selectedCenter.city)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-medium hover:bg-cyan-500/30 transition-colors flex items-center space-x-1.5 self-start"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Get Directions</span>
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Phone className="w-4 h-4 text-cyan-400" />
                    <span>{selectedCenter.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Mail className="w-4 h-4 text-cyan-400" />
                    <span>{selectedCenter.email}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  <span className="font-semibold text-white">Accepted Hazardous & Clean Commodities: </span>
                  {selectedCenter.acceptedCategories.join(', ')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
