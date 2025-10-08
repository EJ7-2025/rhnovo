import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  Target, 
  Heart, 
  Award, 
  TrendingUp, 
  Calendar,
  Users,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

const Dashboard = ({ setCurrentPage }) => {
  const { user, token, API_BASE_URL } = useAuth();
  const [kpis, setKpis] = useState([]);
  const [pdis, setPdis] = useState([]);
  const [recognitions, setRecognitions] = useState([]);
  const [emotionalCheckins, setEmotionalCheckins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      // Buscar KPIs do usuário
      const kpisResponse = await fetch(`${API_BASE_URL}/users/${user.id}/kpis`, { headers });
      if (kpisResponse.ok) {
        const kpisData = await kpisResponse.json();
        setKpis(kpisData.slice(0, 3)); // Mostrar apenas os 3 primeiros
      }

      // Buscar PDIs
      const pdisResponse = await fetch(`${API_BASE_URL}/pdis`, { headers });
      if (pdisResponse.ok) {
        const pdisData = await pdisResponse.json();
        setPdis(pdisData.slice(0, 3));
      }

      // Buscar reconhecimentos recebidos
      const recognitionsResponse = await fetch(`${API_BASE_URL}/users/${user.id}/recognitions/received`, { headers });
      if (recognitionsResponse.ok) {
        const recognitionsData = await recognitionsResponse.json();
        setRecognitions(recognitionsData.slice(0, 3));
      }

      // Buscar check-ins emocionais recentes
      const checkinsResponse = await fetch(`${API_BASE_URL}/emotional-checkins/user/${user.id}`, { headers });
      if (checkinsResponse.ok) {
        const checkinsData = await checkinsResponse.json();
        setEmotionalCheckins(checkinsData.slice(0, 5));
      }

    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getEmotionEmoji = (feeling) => {
    const emotions = {
      'feliz': '😊',
      'neutro': '😐',
      'triste': '😢',
      'animado': '🤩',
      'cansado': '😴',
      'estressado': '😰'
    };
    return emotions[feeling] || '😐';
  };

  const getStatusColor = (status) => {
    const colors = {
      'pendente': 'bg-yellow-100 text-yellow-800',
      'em progresso': 'bg-blue-100 text-blue-800',
      'concluido': 'bg-green-100 text-green-800',
      'atrasado': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header de boas-vindas */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          {getGreeting()}, {user?.first_name}! 👋
        </h1>
        <p className="text-blue-100">
          Bem-vindo ao seu painel de controle. Aqui você pode acompanhar seu progresso e atividades.
        </p>
      </div>

      {/* Cards de estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">KPIs Ativos</p>
                <p className="text-2xl font-bold">{kpis.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">PDIs em Andamento</p>
                <p className="text-2xl font-bold">{pdis.filter(p => p.status !== 'concluido').length}</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reconhecimentos</p>
                <p className="text-2xl font-bold">{recognitions.length}</p>
              </div>
              <Award className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Check-ins</p>
                <p className="text-2xl font-bold">{emotionalCheckins.length}</p>
              </div>
              <Heart className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meus KPIs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Meus KPIs</span>
            </CardTitle>
            <CardDescription>Acompanhe seu desempenho</CardDescription>
          </CardHeader>
          <CardContent>
            {kpis.length > 0 ? (
              <div className="space-y-4">
                {kpis.map((kpi, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Vendas</span>
                      <span className="text-sm text-gray-600">{kpi.value}%</span>
                    </div>
                    <Progress value={kpi.value} className="h-2" />
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => setCurrentPage('kpis')}
                >
                  Ver Todos os KPIs
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum KPI encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Meus PDIs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Meus PDIs</span>
            </CardTitle>
            <CardDescription>Planos de desenvolvimento</CardDescription>
          </CardHeader>
          <CardContent>
            {pdis.length > 0 ? (
              <div className="space-y-4">
                {pdis.map((pdi) => (
                  <div key={pdi.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{pdi.title}</h4>
                      <Badge className={getStatusColor(pdi.status)}>
                        {pdi.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{pdi.description}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(pdi.end_date).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => setCurrentPage('pdi')}
                >
                  Ver Todos os PDIs
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum PDI encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reconhecimentos Recebidos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Reconhecimentos</span>
            </CardTitle>
            <CardDescription>Suas conquistas recentes</CardDescription>
          </CardHeader>
          <CardContent>
            {recognitions.length > 0 ? (
              <div className="space-y-4">
                {recognitions.map((recognition) => (
                  <div key={recognition.id} className="border rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Award className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium">{recognition.badge}</span>
                    </div>
                    {recognition.message && (
                      <p className="text-sm text-gray-600 mb-2">{recognition.message}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      De: {recognition.recognizer_username}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum reconhecimento ainda</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Check-in Emocional */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5" />
              <span>Check-in Emocional</span>
            </CardTitle>
            <CardDescription>Como você está se sentindo</CardDescription>
          </CardHeader>
          <CardContent>
            {emotionalCheckins.length > 0 ? (
              <div className="space-y-3">
                {emotionalCheckins.map((checkin) => (
                  <div key={checkin.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getEmotionEmoji(checkin.feeling)}</span>
                      <span className="capitalize">{checkin.feeling}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(checkin.timestamp).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => setCurrentPage('checkin')}
                >
                  Fazer Check-in
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Faça seu primeiro check-in emocional</p>
                <Button 
                  className="mt-4"
                  onClick={() => setCurrentPage('checkin')}
                >
                  Fazer Check-in
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
