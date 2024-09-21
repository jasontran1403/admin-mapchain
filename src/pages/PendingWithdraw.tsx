import { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import PendingWithdrawTable from '../components/Tables/PendingWithdrawTable';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { URL } from "../types/constant";

const PendingWithdraw = () => {
  const [accessToken, setAccessToken] = useState('');
  const [pendingWithdraw, setPendingWithdraw] = useState([]);

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
      url: `${URL}admin/pending-withdraw`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
    };

    Axios.request(config)
      .then((response) => {
        setPendingWithdraw(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [accessToken]);

  const handleApproveAll = () => {};

  const handleApprove = (code: string) => {
    if (code === null || code === '') {
      return;
    }

    let config = {
      method: 'get',
      url: `${URL}admin/approve/${code}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
    };

    Axios.request(config)
      .then((response) => {
        if (response.data === "ok") {
          toast.success('Withdraw order approve success!', {
            position: 'top-right',
            autoClose: 3000,
            onClick: () => window.location.reload(),
          });
        } else {
          toast.error(response.data, {
            position: 'top-right',
            autoClose: 1500
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Breadcrumb pageName="Pending withdraw" />
      <div className="p-4 md:p-6 xl:p-9">
        <div className="flex flex-wrap gap-5 xl:gap-20">
          <Link
            to="#"
            onClick={handleApproveAll}
            className="inline-flex items-center justify-center rounded-md border border-primary py-4 px-10 text-center font-medium text-primary hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            Approve all
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-10">
        <PendingWithdrawTable
          handleApprove={handleApprove}
          data={pendingWithdraw}
        />
      </div>
    </>
  );
};

export default PendingWithdraw;
