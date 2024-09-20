import { useState, useEffect } from 'react';
import Axios from "axios";
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import TransactionTransfer from '../components/Tables/TransactionTransfer';

const TransferTable = () => {
  const [accessToken, setAccessToken] = useState('');
  const [listTransfer, setListTransfer] = useState([]);

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
      url: 'http://localhost:8888/api/v1/admin/transfer',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "ngrok-skip-browser-warning": "69420",
      },
    };

    Axios.request(config)
      .then((response) => {
        setListTransfer(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [accessToken]);

  console.log(accessToken);
  
  return (
    <>
      <Breadcrumb pageName="Transfer transactions" />

      <div className="flex flex-col gap-10">
        <TransactionTransfer data={listTransfer} />
      </div>
    </>
  );
};

export default TransferTable;
