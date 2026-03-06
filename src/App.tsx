import { useState } from 'react'
import HomePage from './pages/HomePage'
import QuizPage from './pages/QuizPage'
import ResultPage from './pages/ResultPage'
import AdminPage from './pages/AdminPage'

// 简单的路由管理
interface RouteState {
  current: 'home' | 'quiz' | 'result' | 'admin';
  params?: Record<string, string>;
}

function App() {
  const [route, setRoute] = useState<RouteState>({ current: 'home' });

  const navigate = (path: string, params?: Record<string, string>) => {
    const parts = path.split('/').filter(Boolean);
    if (parts.length === 0) {
      setRoute({ current: 'home' });
    } else if (parts[0] === 'quiz') {
      setRoute({ current: 'quiz' });
    } else if (parts[0] === 'result') {
      setRoute({ current: 'result', params });
    } else if (parts[0] === 'admin') {
      setRoute({ current: 'admin' });
    }
  };

  const renderPage = () => {
    switch (route.current) {
      case 'home':
        return <HomePage navigate={navigate} />;
      case 'quiz':
        return <QuizPage navigate={navigate} />;
      case 'result':
        return <ResultPage navigate={navigate} params={route.params} />;
      case 'admin':
        return <AdminPage navigate={navigate} />;
      default:
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderPage()}
    </div>
  );
}

export default App