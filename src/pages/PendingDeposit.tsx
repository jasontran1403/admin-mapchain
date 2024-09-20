import { useState, useEffect } from 'react';
import Axios from "axios";
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import TableThree from '../components/Tables/TableThree';

const PendingDeposit = () => {
  const [accessToken, setAccessToken] = useState('');
  const [pendingDeposit, setPendingDeposit] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token === null || token === '') {
      window.location.href = '/auth/signin';
    } else {
      setAccessToken(token); // Here, token is guaranteed to be a string.
    }
  }, []);

  console.log(accessToken);

  useEffect(() => {
    let config = {
      method: 'get',
      url: 'http://localhost:8888/api/v1/admin/pending-deposit',
      headers: { 
        'Authorization': `Bearer ${accessToken}`,
        "ngrok-skip-browser-warning": "69420",
      }
    };
    
    Axios.request(config)
    .then((response) => {
      setPendingDeposit(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
    
  }, [accessToken]);
  
  
  const handleCollectAll = () => {

  };

  return (
    <>
      <Breadcrumb pageName="Pending Deposit" />
      <div className="p-4 md:p-6 xl:p-9">
        <div className="mb-7.5 flex flex-wrap gap-5 xl:gap-20">
          <Link
            to="#"
            onClick={handleCollectAll}
            className="inline-flex items-center justify-center rounded-md border border-primary py-4 px-10 text-center font-medium text-primary hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            Collect all
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-10">
        <TableThree />
      </div>
    </>
  );
};

export default PendingDeposit;
