import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import './App.css';

// Componente placeholder para páginas não implementadas
const PlaceholderPage = ({ title }) => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600">Esta página está em desenvolvimento.</p>
    </div>
  </div>
);

const AppContent = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard setCurrentPage={setCurrentPage} />;
      case 'kpis':
        return <PlaceholderPage title="Meus KPIs" />;
      case 'pdi':
        return <PlaceholderPage title="PDI - Plano de Desenvolvimento Individual" />;
      case 'academy':
        return <PlaceholderPage title="Academy - Cursos e Treinamentos" />;
      case 'mural':
        return <PlaceholderPage title="Mural de Comunicação" />;
      case 'checkin':
        return <PlaceholderPage title="Check-in Emocional" />;
      case 'assessment':
        return <PlaceholderPage title="Teste de Perfil Comportamental" />;
      case 'profile':
        return <PlaceholderPage title="Meu Perfil" />;
      case 'team':
        return <PlaceholderPage title="Minha Equipe" />;
      case 'analytics':
        return <PlaceholderPage title="Analytics RH" />;
      case 'users':
        return <PlaceholderPage title="Gestão de Usuários" />;
      case 'executive':
        return <PlaceholderPage title="Dashboard Executivo" />;
      default:
        return <Dashboard setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
