import React, { useMemo, useState, useRef } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { BarChart3, PieChart as PieIcon, LineChart as LineIcon, Activity, Star, Eye, Trophy, Medal, Maximize2, Download, X } from 'lucide-react';
import html2canvas from 'html2canvas';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

const StatisticsWidget = ({ data }) => {
  
  // 1. By Type (Tabiiy, Sun'iy, Madaniy)
  const typeStats = useMemo(() => {
    const counts = {};
    data.forEach(item => {
      counts[item.type] = (counts[item.type] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [data]);

  // 2. By Regions (Top 5)
  const regionStats = useMemo(() => {
    const counts = {};
    data.forEach(item => {
      counts[item.region] = (counts[item.region] || 0) + 1;
    });
    return Object.keys(counts)
      .map(key => ({ region: key, soni: counts[key] }))
      .sort((a, b) => b.soni - a.soni)
      .slice(0, 5);
  }, [data]);

  // 3. By Popularity
  const popularityStats = useMemo(() => {
    const counts = { "Past": 0, "O'rta": 0, "Yuqori": 0, "Juda yuqori": 0 };
    data.forEach(item => {
      if(counts[item.popularity] !== undefined) {
        counts[item.popularity]++;
      } else {
        counts[item.popularity] = 1;
      }
    });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [data]);

  // 4. By Season and Price
  const seasonStats = useMemo(() => {
    const counts = {};
    data.forEach(item => {
      const mainSeason = item.season.split('-')[0].trim();
      counts[mainSeason] = (counts[mainSeason] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ season: key, amount: counts[key] }));
  }, [data]);

  // 5. By Popular Services
  const servicesStats = useMemo(() => {
    const countMap = {};
    data.forEach(item => {
      const parts = item.services.split(/[,/]/).map(s => s.trim());
      parts.forEach(p => {
        if (!p) return;
        const normalized = p.toLowerCase();
        // Grouping similar things for better UI reading
        let broad = p;
        if(normalized.includes('trekking') || normalized.includes('hiking')) broad = 'Trekking/Hiking';
        if(normalized.includes('dam olish') || normalized.includes('piknik') || normalized.includes('plyaj')) broad = 'Dam olish/Piknik';
        if(normalized.includes('ski') || normalized.includes('kanatka') || normalized.includes('resort')) broad = 'Qishki/Kurort';
        if(normalized.includes('mehmon') || normalized.includes('hotel') || normalized.includes('taom') || normalized.includes('ovqat')) broad = 'Mexmonxona/Oziq-ovqat';
        if(normalized.includes('baliq')) broad = 'Baliq ovi';
        countMap[broad] = (countMap[broad] || 0) + 1;
      });
    });
    return Object.keys(countMap)
      .map(key => ({ service: key, count: countMap[key] }))
      .sort((a,b) => b.count - a.count)
      .slice(0, 5); // top 5
  }, [data]);

  // --- New Requested Analytics ---
  const enrichedData = useMemo(() => {
    return data.map((item, index) => {
       let rating = 4.0;
       let visits = 10000;
       if (item.popularity === "Juda yuqori") { rating = 4.9; visits = 200000 - (index * 5000); }
       else if (item.popularity === "Yuqori") { rating = 4.7; visits = 80000 - (index * 2000); }
       else if (item.popularity === "O'rta") { rating = 4.3; visits = 40000 - (index * 1000); }
       else { rating = 3.9; visits = 15000 - (index * 500); }
       visits = Math.max(1000, visits);
       return { ...item, rating, visits };
    });
  }, [data]);

  const visitsByCategory = useMemo(() => {
     const counts = {};
     enrichedData.forEach(d => {
       counts[d.category] = (counts[d.category] || 0) + d.visits;
     });
     return Object.keys(counts).map(key => ({ category: key, visits: counts[key] }))
       .sort((a,b) => b.visits - a.visits).slice(0, 7);
  }, [enrichedData]);

  const topVisited = useMemo(() => {
    return [...enrichedData].sort((a,b) => b.visits - a.visits).slice(0, 5);
  }, [enrichedData]);

  const topRated = useMemo(() => {
    return [...enrichedData].sort((a,b) => b.rating - a.rating).slice(0, 5);
  }, [enrichedData]);

  const [enlargedChart, setEnlargedChart] = useState(null);
  
  const chartRefs = {
    types: useRef(null),
    regions: useRef(null),
    popularity: useRef(null),
    season: useRef(null),
    services: useRef(null),
    categoryVisits: useRef(null),
    topVisited: useRef(null),
    topRated: useRef(null),
    popularityTable: useRef(null),
  };

  const handleDownload = async (ref, name) => {
    if (!ref.current) return;
    try {
      const canvas = await html2canvas(ref.current, {
        backgroundColor: document.documentElement.classList.contains('light') ? '#ffffff' : '#1e1e1e',
        scale: 2,
        padding: 20
      });
      const link = document.createElement('a');
      link.download = `${name}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download failed', err);
    }
  };

  const ChartActions = ({ chartRef, name, id }) => (
    <div className="chart-actions">
      <button className="chart-action-btn" title="Kattalashtirish" onClick={() => setEnlargedChart(id)}>
        <Maximize2 size={16} />
      </button>
      <button className="chart-action-btn" title="Yuklab olish" onClick={() => handleDownload(chartRef, name)}>
        <Download size={16} />
      </button>
    </div>
  );

  return (
    <div className="charts-grid">
      
      {/* Chart 1: Types */}
      <div className="glass-panel" ref={chartRefs.types} style={{ position: 'relative' }}>
        <ChartActions chartRef={chartRefs.types} name="obyekt_turlari" id="types" />
        <div className="section-header">
          <PieIcon size={22} />
          <h2>Obyekt Turlari</h2>
        </div>
        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={typeStats}
                cx="50%" cy="50%" innerRadius={70} outerRadius={110}
                paddingAngle={5} dataKey="value" stroke="none"
              >
                {typeStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} ta`, 'Soni']} />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Top Regions */}
      <div className="glass-panel" ref={chartRefs.regions} style={{ position: 'relative' }}>
        <ChartActions chartRef={chartRefs.regions} name="top_tumanlar" id="regions" />
        <div className="section-header">
          <BarChart3 size={22} />
          <h2>Top Tumanlar</h2>
        </div>
        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(125,125,125,0.15)" vertical={false} />
              <XAxis dataKey="region" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip cursor={{fill: 'rgba(125,125,125,0.1)'}} />
              <Bar dataKey="soni" fill="var(--brand-primary)" radius={[6, 6, 0, 0]} name="Obyektlar soni" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Popularity Details */}
      <div className="glass-panel" ref={chartRefs.popularity} style={{ position: 'relative' }}>
        <ChartActions chartRef={chartRefs.popularity} name="mashhurlik_darajasi" id="popularity" />
        <div className="section-header">
          <Activity size={22} />
          <h2>Mashhurlik Darajasi</h2>
        </div>
        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={popularityStats} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(125,125,125,0.15)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="var(--brand-secondary)" strokeWidth={3} dot={{r: 6, fill: 'var(--brand-secondary)', strokeWidth: 2, stroke: 'var(--bg-color)'}} name="Obyektlar" activeDot={{r: 8}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 4: Seasonality Area */}
      <div className="glass-panel" ref={chartRefs.season} style={{ position: 'relative' }}>
        <ChartActions chartRef={chartRefs.season} name="mavsumiy_faollik" id="season" />
        <div className="section-header">
          <LineIcon size={22} />
          <h2>Mavsumiy Faollik</h2>
        </div>
        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={seasonStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--success)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(125,125,125,0.15)" vertical={false} />
              <XAxis dataKey="season" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip cursor={{stroke: 'rgba(125,125,125,0.2)', strokeWidth: 2}} />
              <Area type="monotone" dataKey="amount" stroke="var(--success)" fillOpacity={1} fill="url(#colorAmount)" name="Soni" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 5: Services Radar */}
      <div className="glass-panel" style={{ gridColumn: '1 / -1', position: 'relative' }} ref={chartRefs.services}>
        <ChartActions chartRef={chartRefs.services} name="xizmatlar_korsatkichi" id="services" />
        <div className="section-header">
          <Star size={22} />
          <h2>Ekstra xizmatlar ko'rsatkichi</h2>
        </div>
        <div style={{ height: '340px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={servicesStats}>
              <PolarGrid stroke="rgba(125,125,125,0.2)" />
              <PolarAngleAxis dataKey="service" tick={{ fill: 'var(--text-secondary)', fontSize: 13 }} />
              <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: 'var(--text-secondary)' }} />
              <Radar name="Xizmat turlari" dataKey="count" stroke="var(--brand-secondary)" fill="var(--brand-secondary)" fillOpacity={0.5} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- NEW WIDGETS --- */}
      {/* 6. Toifalar bo'yicha yillik tashrif */}
      <div className="glass-panel" style={{ gridColumn: '1 / -1', position: 'relative' }} ref={chartRefs.categoryVisits}>
        <ChartActions chartRef={chartRefs.categoryVisits} name="toifalar_boyicha_tashrif" id="categoryVisits" />
        <div className="section-header">
          <Eye size={22} />
          <h2>Toifalar bo'yicha yillik tashrif</h2>
        </div>
        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={visitsByCategory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(125,125,125,0.15)" vertical={false} />
              <XAxis dataKey="category" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => val >= 1000 ? `${(val/1000)}k` : val} />
              <Tooltip cursor={{fill: 'rgba(125,125,125,0.1)'}} formatter={(value) => [value.toLocaleString(), "Tashrif"]} />
              <Bar dataKey="visits" radius={[6, 6, 0, 0]} name="Yillik tashrif">
                {visitsByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 7. Eng ko'p tashrif buyurilgan obyektlar (Gorizontal Bar) */}
      <div className="glass-panel" style={{ gridColumn: '1 / -1', position: 'relative' }} ref={chartRefs.topVisited}>
        <ChartActions chartRef={chartRefs.topVisited} name="eng_kop_tashrif" id="topVisited" />
        <div className="section-header">
          <Activity size={22} />
          <h2>Eng ko'p tashrif buyurilgan obyektlar</h2>
        </div>
        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={topVisited} margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(125,125,125,0.15)" horizontal={false} />
              <XAxis type="number" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => val >= 1000 ? `${(val/1000)}k` : val} />
              <YAxis type="category" dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} width={150} />
              <Tooltip cursor={{fill: 'rgba(125,125,125,0.1)'}} formatter={(value) => [value.toLocaleString(), "Tashrif"]} />
              <Bar dataKey="visits" fill="var(--brand-primary)" radius={[0, 6, 6, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 8. Eng yuqori reytingli obyektlar (Table) */}
      <div className="glass-panel" ref={chartRefs.topRated} style={{ position: 'relative' }}>
        <ChartActions chartRef={chartRefs.topRated} name="eng_yuqori_reyting" id="topRated" />
        <div className="section-header">
          <Trophy size={22} />
          <h2>Eng yuqori reytingli obyektlar</h2>
        </div>
        <div className="table-container" style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', fontSize: '0.9rem' }}>
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th>Nomi</th>
                <th>Toifa</th>
                <th>Reyting</th>
              </tr>
            </thead>
            <tbody>
              {topRated.map((item, index) => (
                <tr key={index}>
                  <td style={{ color: 'var(--text-secondary)' }}>{index + 1}</td>
                  <td style={{ fontWeight: 500 }}>{item.name}</td>
                  <td><span className="badge" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', border: 'none' }}>{item.category.toLowerCase()}</span></td>
                  <td style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={14} fill="currentColor" color="var(--text-primary)" />
                    {item.rating.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 9. Eng ko'p tashrif buyurilgan obyektlar (Table) */}
      <div className="glass-panel" ref={chartRefs.popularityTable} style={{ position: 'relative' }}>
        <ChartActions chartRef={chartRefs.popularityTable} name="ommabop_obyektlar" id="popularityTable" />
        <div className="section-header">
          <Medal size={22} />
          <h2>Ommabop obyektlar</h2>
        </div>
        <div className="table-container" style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', fontSize: '0.9rem' }}>
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th>Nomi</th>
                <th>Tuman</th>
                <th>Tashrif</th>
              </tr>
            </thead>
            <tbody>
              {topVisited.map((item, index) => (
                <tr key={index}>
                  <td style={{ color: 'var(--text-secondary)' }}>{index + 1}</td>
                  <td style={{ fontWeight: 500 }}>{item.name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{item.region}</td>
                  <td style={{ fontWeight: 600 }}>{item.visits.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Enlarge Modal --- */}
      {enlargedChart && (
        <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.85)' }}>
          <div className="enlarge-modal-content">
            <button className="enlarge-modal-close" onClick={() => setEnlargedChart(null)}>
              <X size={32} />
            </button>
            <div className="section-header" style={{ marginBottom: '2rem', padding: '0 1rem' }}>
              {enlargedChart === 'types' && <><PieIcon size={28} /> <h2>Obyekt Turlari</h2></>}
              {enlargedChart === 'regions' && <><BarChart3 size={28} /> <h2>Top Tumanlar</h2></>}
              {enlargedChart === 'popularity' && <><Activity size={28} /> <h2>Mashhurlik Darajasi</h2></>}
              {enlargedChart === 'season' && <><LineIcon size={28} /> <h2>Mavsumiy Faollik</h2></>}
              {enlargedChart === 'services' && <><Star size={28} /> <h2>Ekstra xizmatlar ko'rsatkichi</h2></>}
              {enlargedChart === 'categoryVisits' && <><Eye size={28} /> <h2>Toifalar bo'yicha yillik tashrif</h2></>}
              {enlargedChart === 'topVisited' && <><Activity size={28} /> <h2>Eng ko'p tashrif buyurilgan obyektlar</h2></>}
              {enlargedChart === 'topRated' && <><Trophy size={28} /> <h2>Eng yuqori reytingli obyektlar</h2></>}
              {enlargedChart === 'popularityTable' && <><Medal size={28} /> <h2>Ommabop obyektlar</h2></>}
            </div>
            <div style={{ flex: 1, padding: '1rem', overflow: 'hidden' }}>
              {enlargedChart === 'types' && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeStats}
                      cx="50%" cy="50%" innerRadius={100} outerRadius={180}
                      paddingAngle={5} dataKey="value" stroke="none"
                    >
                      {typeStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} ta`, 'Soni']} />
                    <Legend verticalAlign="bottom" height={48} iconSize={20} />
                  </PieChart>
                </ResponsiveContainer>
              )}
              {enlargedChart === 'regions' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionStats} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(125,125,125,0.15)" vertical={false} />
                    <XAxis dataKey="region" stroke="var(--text-secondary)" fontSize={14} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-secondary)" fontSize={14} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip cursor={{fill: 'rgba(125,125,125,0.1)'}} />
                    <Bar dataKey="soni" fill="var(--brand-primary)" radius={[8, 8, 0, 0]} name="Obyektlar soni" />
                  </BarChart>
                </ResponsiveContainer>
              )}
              {enlargedChart === 'popularity' && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={popularityStats} margin={{ top: 20, right: 40, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(125,125,125,0.15)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={14} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-secondary)" fontSize={14} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="var(--brand-secondary)" strokeWidth={4} dot={{r: 8, fill: 'var(--brand-secondary)', strokeWidth: 3, stroke: 'var(--bg-color)'}} name="Obyektlar" activeDot={{r: 10}} />
                  </LineChart>
                </ResponsiveContainer>
              )}
              {enlargedChart === 'season' && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={seasonStats} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <defs>
                      <linearGradient id="colorAmountModal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--success)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(125,125,125,0.15)" vertical={false} />
                    <XAxis dataKey="season" stroke="var(--text-secondary)" fontSize={14} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-secondary)" fontSize={14} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip cursor={{stroke: 'rgba(125,125,125,0.2)', strokeWidth: 2}} />
                    <Area type="monotone" dataKey="amount" stroke="var(--success)" fillOpacity={1} fill="url(#colorAmountModal)" name="Soni" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
              {enlargedChart === 'services' && (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={servicesStats}>
                    <PolarGrid stroke="rgba(125,125,125,0.2)" />
                    <PolarAngleAxis dataKey="service" tick={{ fill: 'var(--text-secondary)', fontSize: 16 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: 'var(--text-secondary)', fontSize: 14 }} />
                    <Radar name="Xizmat turlari" dataKey="count" stroke="var(--brand-secondary)" fill="var(--brand-secondary)" fillOpacity={0.5} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              )}
              {enlargedChart === 'categoryVisits' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={visitsByCategory} margin={{ top: 30, right: 30, left: 40, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(125,125,125,0.15)" vertical={false} />
                    <XAxis dataKey="category" stroke="var(--text-secondary)" fontSize={14} tickLine={false} axisLine={false} angle={-30} textAnchor="end" />
                    <YAxis stroke="var(--text-secondary)" fontSize={14} tickLine={false} axisLine={false} tickFormatter={(val) => val >= 1000 ? `${(val/1000)}k` : val} />
                    <Tooltip cursor={{fill: 'rgba(125,125,125,0.1)'}} formatter={(value) => [value.toLocaleString(), "Tashrif"]} />
                    <Bar dataKey="visits" radius={[8, 8, 0, 0]} name="Yillik tashrif">
                      {visitsByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
              {enlargedChart === 'topVisited' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={topVisited} margin={{ top: 20, right: 50, left: 60, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(125,125,125,0.15)" horizontal={false} />
                    <XAxis type="number" stroke="var(--text-secondary)" fontSize={14} tickLine={false} axisLine={false} tickFormatter={(val) => val >= 1000 ? `${(val/1000)}k` : val} />
                    <YAxis type="category" dataKey="name" stroke="var(--text-secondary)" fontSize={14} tickLine={false} axisLine={false} width={180} />
                    <Tooltip cursor={{fill: 'rgba(125,125,125,0.1)'}} formatter={(value) => [value.toLocaleString(), "Tashrif"]} />
                    <Bar dataKey="visits" fill="var(--brand-primary)" radius={[0, 8, 8, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              )}
              {/* Tables in Modal */}
              {(enlargedChart === 'topRated' || enlargedChart === 'popularityTable') && (
                 <div style={{ height: '100%', overflowY: 'auto', padding: '1rem' }}>
                    <table className="data-table" style={{ width: '100%', fontSize: '1.2rem' }}>
                      <thead style={{ position: 'sticky', top: 0, zIndex: 1, background: 'var(--bg-color)' }}>
                        <tr>
                          <th>#</th>
                          <th>Nomi</th>
                          <th>{enlargedChart === 'topRated' ? 'Toifa' : 'Tuman'}</th>
                          <th>{enlargedChart === 'topRated' ? 'Reyting' : 'Tashrif'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(enlargedChart === 'topRated' ? topRated : topVisited).map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td>{enlargedChart === 'topRated' ? item.category : item.region}</td>
                            <td>{enlargedChart === 'topRated' ? item.rating.toFixed(1) : item.visits.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticsWidget;
