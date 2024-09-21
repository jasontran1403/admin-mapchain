import { useState, useEffect } from 'react';
import Axios from "axios";
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import TransactionWithdraw from '../components/Tables/TransactionWithdraw';
import { URL } from "../types/constant";

const WithdrawTable = () => {
  const [accessToken, setAccessToken] = useState('');
  const [listWithdraw, setListWithdraw] = useState([]);

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
      url: `${URL}admin/withdraw`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "ngrok-skip-browser-warning": "69420",
      },
    };

    Axios.request(config)
      .then((response) => {
        setListWithdraw(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [accessToken]);

  console.log(accessToken);
  
  return (
    <>
      <Breadcrumb pageName="Withdraw transactions" />

      <div className="flex flex-col gap-10">
        <TransactionWithdraw data={listWithdraw} />
      </div>
    </>
  );
};

export default WithdrawTable;
