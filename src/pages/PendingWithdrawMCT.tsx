import { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import PendingWithdrawTable from '../components/Tables/PendingWithdrawTable';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { URL } from "../types/constant";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

const PendingWithdrawMCT = () => {
  const [buttonDisabled, setButtonDisabled] = useState(false);

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


  useEffect(() => {
    let config = {
      method: 'get',
      url: `${URL}admin/pending-withdraw-mct`,
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
    return;
    if (buttonDisabled) return;
    if (code === null || code === '') {
      return;
    }

    Swal.fire({
      title: 'Confirm withdraw',
      text: `Are you sure you want to approve`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, transfer it!',
      cancelButtonText: 'No, cancel',
      reverseButtons: true,
      customClass: {
        confirmButton: 'custom-confirm-button', // Custom class for confirm button
        cancelButton: 'custom-cancel-button',   // Custom class for cancel button
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        setButtonDisabled(true);
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
              setButtonDisabled(true);

              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Withdraw order approve success',
                showConfirmButton: false,
                timer: 2000,
              }).then(() => {
                window.location.reload();
              });
            } else {
              setButtonDisabled(false);

              toast.error(response.data, {
                position: 'top-right',
                autoClose: 1500
              });
            }
          })
          .catch((error) => {
            setButtonDisabled(false);

            console.log(error);
          });
      }
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

export default PendingWithdrawMCT;
