import { AuthProvider } from '../context/authContext';
import { Analytics } from '@vercel/analytics/react';
import SideBar from '../components/SideBar';
import '@/styles/globals.css';
export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <div className="flex flex-wrap lg:flex-nowrap h-screen w-screen">
        <SideBar />
        <div className="m-4 h-inherit w-full overflow-y-scroll">
          {' '}
          <Component {...pageProps} />
          <Analytics />
        </div>
      </div>
    </AuthProvider>
  );
}
