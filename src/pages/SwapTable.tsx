import { useState, useEffect } from 'react';
import Axios from "axios";
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import TransactionSwap from '../components/Tables/TransactionSwap';

const SwapTable = () => {
  const [accessToken, setAccessToken] = useState('');

  const [listSwap, setListSwap] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token === null || token === '') {
      window.location.href = '/auth/signin';
    } else {
      setAccessToken(token); // Here, token is guaranteed to be a string.
    }
  }, []);

  useEffect(() => {
    let config = {
      method: 'get',
      url: 'http://localhost:8888/api/v1/admin/swap',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "ngrok-skip-browser-warning": "69420",
      },
    };

    Axios.request(config)
      .then((response) => {
        setListSwap(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [accessToken]);

  console.log(accessToken);
  
  return (
    <>
      <Breadcrumb pageName="Swap transactions" />

      <div className="flex flex-col gap-10">
        <TransactionSwap data={listSwap} />
      </div>
    </>
  );
};

export default SwapTable;
