import React, { useState } from 'react';
import { PlusCircle, List, Settings, Download, Edit2, Trash2, Save, X, Database, Mountain, Sunrise, Map } from 'lucide-react';

const AdminPanel = ({ data, onAddData, onEditData, onDeleteData }) => {
  const [editingId, setEditingId] = useState(null);
  const [deleteModalId, setDeleteModalId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', type: 'Tabiiy', category: '', region: '', address: '',
    lat: '', lng: '', description: '', services: '', price: '', season: '', popularity: 'O\'rta'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newData = {
      ...formData,
      lat: parseFloat(formData.lat) || 0,
      lng: parseFloat(formData.lng) || 0,
    };
    
    if (editingId) {
      if (onEditData) onEditData(editingId, newData);
      setEditingId(null);
      alert("Ma'lumot muvaffaqiyatli saqlandi!");
    } else {
      if (onAddData) onAddData(newData);
      alert("Yangi ma'lumot muvaffaqiyatli qo'shildi!");
    }
    
    setFormData({
      name: '', type: 'Tabiiy', category: '', region: '', address: '', 
      lat: '', lng: '', description: '', services: '', price: '', season: '', popularity: 'O\'rta'
    });
    setIsFormOpen(false);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name || '', type: item.type || 'Tabiiy', category: item.category || '', 
      region: item.region || '', address: item.address || '', lat: item.lat || '', 
      lng: item.lng || '', description: item.description || '', services: item.services || '', 
      price: item.price || '', season: item.season || '', popularity: item.popularity || 'O\'rta'
    });
    setIsFormOpen(true);
  };

  const confirmDelete = () => {
    if (deleteModalId && onDeleteData) {
      onDeleteData(deleteModalId);
    }
    setDeleteModalId(null);
  };

  const handleDownloadCSV = () => {
    if (!data || data.length === 0) return;
    
    const headers = ["ID", "Nomi", "Turi", "Kategoriya", "Tuman", "Manzil", "Latitude", "Longitude", "Mavsum", "Mashhurlik", "Xizmatlar", "Narxi"];
    const csvRows = [headers.join(",")];
    
    data.forEach(item => {
      const row = [
        item.id || '',
        `"${item.name || ''}"`, 
        `"${item.type || ''}"`,
        `"${item.category || ''}"`,
        `"${item.region || ''}"`,
        `"${item.address || ''}"`,
        item.lat || '',
        item.lng || '',
        `"${item.season || ''}"`,
        `"${item.popularity || ''}"`,
        `"${item.services || ''}"`,
        `"${item.price || ''}"`
      ];
      csvRows.push(row.join(","));
    });
    
    // Add BOM for proper UTF-8 Excel support
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(csvRows.join("\n"));
    const link = document.createElement("a");
    link.download = "turizm_obyektlari.csv";
    link.href = csvContent;
    link.click();
  };

  const adminStats = {
    total: data.length,
    tabiiy: data.filter(d => d.type === 'Tabiiy').length,
    madaniy: data.filter(d => d.type === 'Madaniy').length,
    yoz: data.filter(d => d.season.toLowerCase().includes('yoz')).length
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
      <div className="section-header" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Settings size={28} />
          <h1 style={{ margin: 0 }}>Admin Boshqaruvi</h1>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingId(null); setIsFormOpen(true); }}>
          <PlusCircle size={18} /> Yangi obyekt qo'shish
        </button>
      </div>

      {/* Admin KPI Cards */}
      <div className="stats-cards" style={{ marginBottom: '2rem' }}>
        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{color: 'var(--brand-primary)'}}><Database size={24} /></div>
          <div className="stat-info">
            <h3>{adminStats.total}</h3>
            <p>Jami manzillar</p>
          </div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{color: 'var(--success)'}}><Mountain size={24} /></div>
          <div className="stat-info">
            <h3>{adminStats.tabiiy}</h3>
            <p>Tabiiy maskanlar</p>
          </div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{color: 'var(--warning)'}}><Map size={24} /></div>
          <div className="stat-info">
            <h3>{adminStats.madaniy}</h3>
            <p>Madaniy obyektlar</p>
          </div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{color: 'var(--danger)'}}><Sunrise size={24} /></div>
          <div className="stat-info">
            <h3>{adminStats.yoz}</h3>
            <p>Yozgi obyektlar</p>
          </div>
        </div>
      </div>

      {/* Main Table Panel (Full Width) */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div className="glass-panel admin-table-panel" style={{ flex: 1 }}>
          <div className="section-header" style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <List size={18} />
              Barcha manzillar ({data.length})
            </div>
            <button type="button" onClick={handleDownloadCSV} className="btn" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--brand-primary)', border: '1px solid var(--brand-primary)' }}>
              <Download size={14} /> CSV Yuklash
            </button>
          </div>
          
          <div className="table-container">
            <table className="data-table details-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>#</th>
                  <th>Obyekt nomi</th>
                  <th>Turi</th>
                  <th>Subkategoriya</th>
                  <th>Tuman</th>
                  <th>Manzil</th>
                  <th>Koordinata (Lat/Long)</th>
                  <th>Tavsif</th>
                  <th>Xizmatlar</th>
                  <th>Narx / Mavsum</th>
                  <th>Mashhurlik</th>
                  <th style={{ textAlign: 'center', width: '80px' }}>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={item.id || index}>
                    <td style={{ color: 'var(--text-secondary)' }}>{index + 1}</td>
                    <td style={{ fontWeight: 500 }}>{item.name}</td>
                    <td>
                      <span className={`badge badge-${item.type.toLowerCase().replace("'", "")}`}>
                        {item.type}
                      </span>
                    </td>
                    <td>{item.category}</td>
                    <td>{item.region}</td>
                    <td>{item.address}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{item.lat}, {item.lng}</td>
                    <td style={{ maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.description}</td>
                    <td>{item.services}</td>
                    <td>{item.price} <span style={{color:'var(--text-secondary)'}}>/ {item.season}</span></td>
                    <td>
                      <span className={`badge badge-${item.popularity.toLowerCase().replace("'", "").replace(" ", "")} popularity-badge`}>
                        {item.popularity}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                         <button onClick={() => startEdit(item)} className="action-btn edit-btn" title="Tahrirlash">
                           <Edit2 size={16} />
                         </button>
                         <button onClick={() => setDeleteModalId(item.id)} className="action-btn delete-btn" title="O'chirish">
                           <Trash2 size={16} />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Custom Form Modal for Adding / Editing */}
      {isFormOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px', width: '95%', textAlign: 'left', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                {editingId ? <><Edit2 size={22} /> Obyektni tahrirlash</> : <><PlusCircle size={22} /> Yangi obyekt qo'shish</>}
              </h2>
              <button className="action-btn" onClick={() => setIsFormOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="responsive-form-grid">
                <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                  <label className="form-label">Obyekt nomi</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" required />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Turi</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="form-select">
                    <option value="Tabiiy">Tabiiy</option>
                    <option value="Sun'iy">Sun'iy</option>
                    <option value="Madaniy">Madaniy</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Kategoriya</label>
                  <input type="text" name="category" value={formData.category} onChange={handleChange} className="form-input" required />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Tuman</label>
                  <input type="text" name="region" value={formData.region} onChange={handleChange} className="form-input" required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Manzil</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} className="form-input" required />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Latitude</label>
                  <input type="number" step="0.000001" name="lat" value={formData.lat} onChange={handleChange} className="form-input" required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Longitude</label>
                  <input type="number" step="0.000001" name="lng" value={formData.lng} onChange={handleChange} className="form-input" required />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                  <label className="form-label">Tavsif</label>
                  <input type="text" name="description" value={formData.description} onChange={handleChange} className="form-input" required />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Mavsum</label>
                  <input type="text" name="season" value={formData.season} onChange={handleChange} className="form-input" required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Mashhurlik</label>
                  <select name="popularity" value={formData.popularity} onChange={handleChange} className="form-select">
                    <option value="Past">Past</option>
                    <option value="O'rta">O'rta</option>
                    <option value="Yuqori">Yuqori</option>
                    <option value="Juda yuqori">Juda yuqori</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn" onClick={() => setIsFormOpen(false)} style={{ flex: 1, background: 'var(--glass-border)', color: 'var(--text-primary)' }}>
                  Bekor qilish
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, background: editingId ? 'var(--brand-secondary)' : 'var(--brand-primary)' }}>
                  {editingId ? <><Save size={18} /> Saqlash</> : <><PlusCircle size={18} /> Qo'shish</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Global Modal for Delete Confirmation */}
      {deleteModalId && (
        <div className="modal-overlay">
          <div className="modal-content">
             <div className="modal-icon warning">
               <Trash2 size={32} />
             </div>
             <h2>Obyektni o'chirish</h2>
             <p>Rostdan ham ushbu ma'lumotni butkul o'chirib yubormoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.</p>
             <div className="modal-actions">
               <button className="btn" onClick={() => setDeleteModalId(null)} style={{ background: 'var(--glass-border)', color: 'var(--text-primary)' }}>
                 Bekor qilish
               </button>
               <button className="btn btn-primary" onClick={confirmDelete} style={{ background: '#ef4444' }}>
                 Ha, qo'shilaman
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
