import { useState, useEffect } from 'react';
import Axios from 'axios';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import TransactionDeposit from '../components/Tables/TransactionDeposit';

const DepositTable = () => {
  const [accessToken, setAccessToken] = useState('');
  const [listDeposit, setListDeposit] = useState([]);

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
      url: 'http://localhost:8888/api/v1/admin/deposit',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "ngrok-skip-browser-warning": "69420",
      },
    };

    Axios.request(config)
      .then((response) => {
        setListDeposit(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [accessToken]);

  console.log(accessToken);

  return (
    <>
      <Breadcrumb pageName="Deposit transactions" />

      <div className="flex flex-col gap-10">
        <TransactionDeposit data={listDeposit} />
      </div>
    </>
  );
};

export default DepositTable;
