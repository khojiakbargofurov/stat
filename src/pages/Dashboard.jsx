import React, { useMemo, useRef } from 'react';
import StatisticsWidget from '../components/StatisticsWidget';
import { Map, Mountain, Sunrise, Sparkles, TrendingUp, Users, Download } from 'lucide-react';
import html2canvas from 'html2canvas';

const Dashboard = ({ data }) => {
  const dashboardRef = useRef(null);
  const totalLocations = data.length;
  const regionsCount = useMemo(() => new Set(data.map(item => item.region)).size, [data]);
  const categoriesCount = useMemo(() => new Set(data.map(item => item.category)).size, [data]);
  
  const topPopular = useMemo(() => data.filter(item => item.popularity === "Juda yuqori").length, [data]);

  const handleDownloadImage = async () => {
    if (!dashboardRef.current) return;
    try {
      const canvas = await html2canvas(dashboardRef.current, {
        backgroundColor: document.documentElement.classList.contains('light') ? '#f8fafc' : '#0f172a',
        scale: 2,
        useCORS: true,
      });
      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.download = "turizm_statistikasi.png";
      link.href = image;
      link.click();
    } catch (error) {
      console.error("Rasm yuklashda xato:", error);
      alert("Rasm qilib saqlashda xatolik yuz berdi");
    }
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingRight: '0.5rem' }}>
      <div className="section-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <TrendingUp size={28} />
          <h1 style={{ margin: 0 }}>Asosiy Statistika</h1>
        </div>
        <button onClick={handleDownloadImage} className="btn btn-primary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
          <Download size={18} />
          Rasm sifatida yuklash
        </button>
      </div>

      <div ref={dashboardRef} style={{ padding: '0.5rem', margin: '-0.5rem' }}>
        {/* KPI Cards Row 1 */}
      <div className="stats-cards">
        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{color: 'var(--brand-primary)'}}>
            <Map size={24} />
          </div>
          <div className="stat-info">
            <h3>{totalLocations}</h3>
            <p>Jami Obyektlar</p>
          </div>
        </div>
        
        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{color: 'var(--success)'}}>
            <Mountain size={24} />
          </div>
          <div className="stat-info">
            <h3>{regionsCount}</h3>
            <p>Tuman hududlar</p>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{color: 'var(--warning)'}}>
            <Sunrise size={24} />
          </div>
          <div className="stat-info">
            <h3>{categoriesCount}</h3>
            <p>Yo'nalishlar</p>
          </div>
        </div>
        
        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{color: 'var(--danger)'}}>
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>{topPopular} ta</h3>
            <p>Juda mashhur maskan</p>
          </div>
        </div>
      </div>

      {/* Advanced Charts Grid */}
      <StatisticsWidget data={data} />
      </div>
    </div>
  );
};

export default Dashboard;
