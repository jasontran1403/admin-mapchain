import React, { useState, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header/index';
import Sidebar from '../components/Sidebar/index';

const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const isSignInPath = location.pathname === '/auth/signin';

  return (
    <>
      {!isSignInPath ? (
        <div className="dark:bg-boxdark-2 dark:text-bodydark h-screen">
          {/* Page Wrapper */}
          <div className="flex h-full overflow-hidden">
            {/* Sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Content Area */}
            <div className="relative flex flex-1 flex-col">
              {/* Header */}
              <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

              {/* Main Content */}
              <main className="flex-1 flex items-center justify-center">
                <div className="w-full h-full max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </div>

      ) : (
        <main>
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {children}
          </div>
        </main>
      )}
    </>
  );
};

export default DefaultLayout;
