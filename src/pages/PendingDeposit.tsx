import { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import PendingDepositTable from '../components/Tables/PendingDepositTable';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { URL } from "../types/constant";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

const PendingDeposit = () => {
  const [accessToken, setAccessToken] = useState('');
  const [listUnCollect, setListUnCollect] = useState([]);

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
      maxBodyLength: Infinity,
      url: `${URL}admin/pending-deposit`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
    };

    Axios.request(config)
      .then((response) => {
        setListUnCollect(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [accessToken]);

  const handleCollectAll = () => {};

  const handleCollectWallet = (walletAddress: string) => {
    if (walletAddress === null || walletAddress === '') {
      return;
    }

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${URL}admin/pending-deposit/${walletAddress}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          `Bearer ${accessToken}`,
          "ngrok-skip-browser-warning": "69420",
      }
    };

    Axios
      .request(config)
      .then((response) => {
        if (response.data === "ok") {
          // toast.success("Collect amount success", {
          //   position: 'top-right',
          //   autoClose: 3000,
          //   onClick: () => {
          //     window.location.reload();
          //   },
          // });
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Collect amount success',
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            window.location.reload();
          });
        } else {
          toast.error(response.data, {
            position: 'top-right',
            autoClose: 3000
          });
        }
      })
      .catch((error) => {
        toast.error("Failed when collect", {
          position: 'top-right',
          autoClose: 3000
        });
      });
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
        <PendingDepositTable
          data={listUnCollect}
          handleCollect={handleCollectWallet}
        />
      </div>
      <ToastContainer />
    </>
  );
};

export default PendingDeposit;
