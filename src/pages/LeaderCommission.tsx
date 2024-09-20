import { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import TableOne from '../components/Tables/TableOne';
import TableThree from '../components/Tables/TableThree';
import TableTwo from '../components/Tables/TableTwo';

const LeaderCommission = () => {
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token === null || token === '') {
      window.location.href = '/auth/signin';
    } else {
      setAccessToken(token); // Here, token is guaranteed to be a string.
    }
  }, []);

  console.log(accessToken);
  
  return (
    <>
      <Breadcrumb pageName="Leader commission table" />
      <div className="flex flex-col gap-10">
        <TableThree />
      </div>
    </>
  );
};

export default LeaderCommission;
