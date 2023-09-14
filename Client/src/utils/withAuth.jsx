import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/authContext';
import Unauthorized from '../components/Unauthorised';
import Loading from '../components/Loading';
import { useRouter } from 'next/router';
import jwt_decode from 'jwt-decode';

const withAuth = (WrappedComponent, adminOnly = false, isPage = false) => {
  const WithAuthComponent = (props) => {
    const { currentUser, isLoading, isAuthenticated, logout } =
      useContext(AuthContext);
    const router = useRouter();
    const [authCheckComplete, setAuthCheckComplete] = useState(false);

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push('/auth/login');
      } else if (!isLoading) {
        setAuthCheckComplete(true);
      }
    }, [currentUser, isLoading, isAuthenticated]);

    if (isLoading || !authCheckComplete) {
      return isPage ? <Loading /> : null;
    } else if (!isAuthenticated && isPage) {
      return <Unauthorized />;
    } else if (
      adminOnly &&
      isPage &&
      (!currentUser || currentUser.role !== 'admin')
    ) {
      return <Unauthorized />;
    } else {
      return <WrappedComponent {...props} />;
    }
  };

  WithAuthComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithAuthComponent;
};

export default withAuth;
