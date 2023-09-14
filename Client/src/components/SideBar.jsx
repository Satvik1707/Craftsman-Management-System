import React, { useState, useContext, useEffect, use } from 'react';
import { useRouter } from 'next/router';
import { FaArrowLeft, FaBars, FaTimes } from 'react-icons/fa';
import { AuthContext } from '../context/authContext';
import withAuth from '../utils/withAuth';
import Link from 'next/link';
import SettingModal from './Modals/SettingsModal';
const Sidebar = () => {
  const { logout, currentUser, isAdmin } = useContext(AuthContext);
  const Router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [showSettingModal, setShowSettingModal] = useState(false);
  const [pathName, setPathName] = useState(Router.pathname);
  const openSettingModal = () => {
    setShowSettingModal(true);
  };
  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };
  useEffect(() => {
    setShowMenu(false);
  }, [Router.pathname]);

  if (
    Router.pathname === '/auth/login' ||
    Router.pathname === '/404' ||
    Router.pathname === '/' ||
    !currentUser
  )
    return null;
  else
    return (
      <div className="lg:visible border-x-2 px-4 py-2 w-full lg:w-1/6 h-fit lg:h-screen shadow-lg flex justify-between items-center lg:items-start">
        <button
          onClick={() => {
            Router.back();
          }}
          className="block lg:hidden border-2 border-black text-black px-2 py-2 rounded w-fit mb-2"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-md md:text-lg lg:hidden visible font-bold mb-4 text-center mx-4">Craftsman Management System</h1>
        <button
          onClick={handleMenuClick}
          className="block lg:hidden border-2 border-black text-black px-2 py-2 rounded w-fit mb-2"
        >
          {showMenu ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`lg:block ${showMenu ? 'block' : 'hidden'}`}>
          <div className="w-full border-2 border-black rounded mb-4 px-2 py-2">
            {['username', 'role', 'user_id'].map((item) => {
              return (
                <>
                  <p key={item} className="text-md mb-2 text-gray-700 text-sm">
                    <span className="font-bold">{item.toUpperCase()}</span>{' '}
                    {currentUser[item]}
                  </p>
                </>
              );
            })}
          </div>
          <Link href="/Routes" passHref>
            <button className="border-2 border-black text-black p-2 rounded w-full mb-2">
              Routes
            </button>
          </Link>
          {isAdmin &&
            ['Users', 'Materials', 'Issues', 'Tools'].map((item) => {
              return (
                <>
                  <Link key={item} href={`/${item}`} passHref>
                    <button className="border-2 border-black text-black p-2 rounded w-full mb-2">
                      {item}
                    </button>
                  </Link>
                </>
              );
            })}
          {isAdmin && (
            <button
              onClick={openSettingModal}
              className="border-2 border-black text-black p-2 rounded w-full mb-2"
            >
              Settings
            </button>
          )}
          {showSettingModal && (
            <SettingModal setShowSettingModal={setShowSettingModal} />
          )}
          <button
            onClick={logout}
            className="border-2 border-black text-black p-2 rounded w-full mb-2"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
};

export default withAuth(Sidebar);
