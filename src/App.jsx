import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MapPage from './pages/MapPage';
import AdminPanel from './pages/AdminPanel';
import { initialTourismData } from './data/tourismData';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const savedData = localStorage.getItem('tourismData');
    if (savedData) {
      setData(JSON.parse(savedData));
    } else {
      setData(initialTourismData);
      localStorage.setItem('tourismData', JSON.stringify(initialTourismData));
    }
  }, []);

  const handleAddData = (newItem) => {
    const nextId = data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1;
    const updatedData = [...data, { ...newItem, id: nextId }];
    setData(updatedData);
    localStorage.setItem('tourismData', JSON.stringify(updatedData));
  };

  const handleEditData = (id, modifiedItem) => {
    const updatedData = data.map(item => item.id === id ? { ...modifiedItem, id } : item);
    setData(updatedData);
    localStorage.setItem('tourismData', JSON.stringify(updatedData));
  };

  const handleDeleteData = (id) => {
    const updatedData = data.filter(item => item.id !== id);
    setData(updatedData);
    localStorage.setItem('tourismData', JSON.stringify(updatedData));
  };

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard data={data} />} />
        <Route path="map" element={<MapPage data={data} />} />
        <Route 
          path="admin" 
          element={
            <AdminPanel 
              data={data} 
              onAddData={handleAddData} 
              onEditData={handleEditData}
              onDeleteData={handleDeleteData}
            />
          } 
        />
      </Route>
    </Routes>
  );
}

export default App;
