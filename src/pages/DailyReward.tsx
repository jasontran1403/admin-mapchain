import { useState, useEffect } from 'react';
import Axios from "axios";
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import CommissionTable from '../components/Tables/CommissionTable';
import { URL } from "../types/constant";

const DailyReward = () => {
  const [accessToken, setAccessToken] = useState('');
  const [listDirectCommission, setListDirectCommission] = useState([]);

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
      url: `${URL}admin/commission/0`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "ngrok-skip-browser-warning": "69420",
      },
    };

    Axios.request(config)
      .then((response) => {
        setListDirectCommission(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [accessToken]);

  console.log(accessToken);
  
  return (
    <>
      <Breadcrumb pageName="Binary commission transactions" />

      <div className="flex flex-col gap-10">
        <CommissionTable data={listDirectCommission} />
      </div>
    </>
  );
};

export default DailyReward;
