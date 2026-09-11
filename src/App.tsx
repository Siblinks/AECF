import { useEffect } from 'react';
import { RouterProvider, useRouter } from '@/lib/router';
import { AuthProvider, useAuth } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import About from '@/pages/About';
import News from '@/pages/News';
import NewsDetail from '@/pages/NewsDetail';
import Sectors, { SectorDetail } from '@/pages/Sectors';
import Directory from '@/pages/Directory';
import Projects, { ProjectDetail } from '@/pages/Projects';
import Register from '@/pages/Register';
import Opportunities from '@/pages/Opportunities';
import Admin from '@/pages/Admin';
import Login from '@/pages/Login';
import { Loader2 } from 'lucide-react';

function Routes() {
  const { route } = useRouter();

  let page: React.ReactNode;
  let showFooter = true;

  if (route === '/' || route === '') {
    page = <Home />;
  } else if (route === '/about') {
    page = <About />;
  } else if (route === '/news') {
    page = <News />;
  } else if (route.startsWith('/news/')) {
    page = <NewsDetail id={route.split('/')[2]} />;
  } else if (route === '/sectors') {
    page = <Sectors />;
  } else if (route.startsWith('/sectors/')) {
    page = <SectorDetail sectorKey={route.split('/')[2]} />;
  } else if (route === '/directory') {
    page = <Directory />;
  } else if (route === '/projects') {
    page = <Projects />;
  } else if (route.startsWith('/projects/')) {
    page = <ProjectDetail id={route.split('/')[2]} />;
  } else if (route === '/register') {
    page = <Register />;
  } else if (route === '/opportunities') {
    page = <Opportunities />;
  } else if (route === '/admin') {
    page = <AdminGate />;
    showFooter = false;
  } else if (route === '/login') {
    page = <Login />;
    showFooter = false;
  } else {
    page = <Home />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">{page}</div>
      {showFooter && <Footer />}
      {/* Bottom bar spacer for mobile */}
      <div className="h-14 lg:hidden" />
    </div>
  );
}

function AdminGate() {
  const { user, isAdmin, loading } = useAuth();
  const { navigate } = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/login');
    }
  }, [loading, user, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return <Admin />;
}

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider>
        <Routes />
      </RouterProvider>
    </AuthProvider>
  );
}
