import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import { tutorMarketplaceService } from '../../services/marketplaceService';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Search, MapPin, Globe, ArrowRight, Star } from 'lucide-react';

export default function BrowseTutors() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Advanced filters state
  const [maxPrice, setMaxPrice] = useState(5000);
  const [subjectFilter, setSubjectFilter] = useState('');
  const [modeFilter, setModeFilter] = useState(''); // 'online', 'offline', ''

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await tutorMarketplaceService.getPublicTutors();
        setTutors(res.data.data);
      } catch (err) {
        console.error('Failed to load tutors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, []);

  // Extract all unique subjects from all tutors to build the dropdown
  const allSubjects = Array.from(new Set(tutors.flatMap(t => t.subjects || []))).sort();

  const filteredTutors = tutors.filter((t) => {
    // 1. Keyword search
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                          t.subjects.some(s => s.toLowerCase().includes(search.toLowerCase()));
    if (!matchesSearch) return false;

    // 2. Max Price search
    if (t.minPrice > maxPrice) return false;

    // 3. Subject filter
    if (subjectFilter && !t.subjects.includes(subjectFilter)) return false;

    // 4. Mode filter
    const hasLocations = t.locations && t.locations.length > 0;
    if (modeFilter === 'online' && hasLocations) return false; // If online, must have NO locations (online only)
    if (modeFilter === 'offline' && !hasLocations) return false; // If offline, MUST have locations

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Hero Section with gradient */}
      <div className="relative overflow-hidden py-20" style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2563EB 40%, #3b82f6 70%, #7C3AED 100%)',
      }}>
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-60px] left-[-60px] w-48 h-48 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }} />
          <div className="absolute bottom-[-40px] right-[10%] w-64 h-64 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }} />
          <div className="absolute top-[20%] right-[30%] w-32 h-32 rounded-full opacity-[0.06]"
            style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }} />
        </div>

        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up tracking-tight">
            Find your perfect tutor
          </h1>
          <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto animate-fade-in-up delay-100">
            Browse our open marketplace of expert tutors. Book individual or group sessions instantly with exact availability slots.
          </p>
          
          {/* Glassmorphism search bar */}
          <div className="max-w-xl mx-auto relative animate-fade-in-up delay-200">
            <div className="relative rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
              }}
            >
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/60" size={20} />
              <input 
                type="text"
                placeholder="Search by name or subject (e.g., Math, Piano)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-14 pr-5 py-4 bg-transparent text-white placeholder-white/50 focus:outline-none text-base"
              />
            </div>
            
            {/* Advanced Filters */}
            <div className="mt-4 flex flex-col md:flex-row gap-4 max-w-2xl mx-auto items-center">
              <select 
                title="Subject Filter"
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="flex-1 rounded-xl bg-white/10 border border-white/20 text-white px-4 py-2.5 focus:outline-none focus:bg-white/20 [&>option]:text-slate-900"
              >
                <option value="">All Subjects</option>
                {allSubjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
              </select>

              <select 
                title="Mode Filter"
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value)}
                className="flex-1 rounded-xl bg-white/10 border border-white/20 text-white px-4 py-2.5 focus:outline-none focus:bg-white/20 [&>option]:text-slate-900"
              >
                <option value="">Any Mode</option>
                <option value="online">Online Only</option>
                <option value="offline">In-Person/Offline</option>
              </select>

              <div className="flex-1 w-full flex flex-col px-2">
                <div className="flex justify-between text-white/80 text-xs mb-1">
                  <span>Max Price</span>
                  <span>₹{maxPrice}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="5000" 
                  step="100" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full accent-white"
                />
              </div>
            </div>
          </div>

          {/* Stats pills */}
          <div className="flex justify-center gap-6 mt-8 animate-fade-in-up delay-300">
            {[
              { label: 'Expert Tutors', value: tutors.length || '—' },
              { label: 'Subjects', value: '10+' },
              { label: 'Satisfaction', value: '4.8★' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-white/60 text-sm">
                <span className="font-bold text-white">{s.value}</span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tutor Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredTutors.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-slate-500 text-lg">No tutors found matching your search.</p>
            <p className="text-slate-400 text-sm mt-2">Try a different keyword or browse all tutors.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <p className="text-slate-500 text-sm">
                Showing <span className="font-semibold text-slate-900">{filteredTutors.length}</span> tutor{filteredTutors.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTutors.map((tutor, index) => (
                <Link key={tutor._id} to={`/book/${tutor.slug}`} className="block group animate-fade-in-up"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <Card className="h-full border-slate-200/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-brand-primary/20 overflow-hidden">
                    {/* Top accent bar */}
                    <div className="h-1 w-full" style={{
                      background: 'linear-gradient(90deg, #2563EB, #7C3AED)',
                    }} />
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        {tutor.avatar ? (
                          <img src={tutor.avatar} alt={tutor.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 transition-transform duration-300 group-hover:scale-105" />
                        ) : (
                          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white transition-transform duration-300 group-hover:scale-105"
                            style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
                          >
                            {tutor.name.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-slate-900 group-hover:text-brand-primary transition-colors truncate">{tutor.name}</h3>
                          <p className="text-sm text-slate-500 line-clamp-2 mt-0.5">{tutor.bio || 'Professional Tutor'}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {tutor.subjects.slice(0, 3).map((sub, i) => (
                          <Badge key={i} variant="secondary" className="bg-blue-50 text-blue-700 border-0 text-xs font-medium px-2.5 py-1">{sub}</Badge>
                        ))}
                        {tutor.subjects.length > 3 && (
                          <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-0 text-xs font-medium px-2.5 py-1">+{tutor.subjects.length - 3}</Badge>
                        )}
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
                        <div className="flex flex-col gap-1 text-slate-500">
                          {tutor.locations?.length > 0 ? (
                             <div className="flex items-center gap-1.5"><MapPin size={14} className="text-brand-primary/60" /> {tutor.locations[0]} {tutor.locations.length > 1 && `+${tutor.locations.length - 1}`}</div>
                          ) : (
                             <div className="flex items-center gap-1.5"><Globe size={14} className="text-brand-primary/60" /> Online Only</div>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-slate-400 block">Starting from</span>
                          <span className="font-bold text-slate-900 text-base">₹{tutor.minPrice}</span>
                        </div>
                      </div>

                      {/* View Profile CTA */}
                      <div className="mt-4 flex items-center justify-center gap-2 text-brand-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        View Profile <ArrowRight size={16} />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
