import { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import PendingDepositTable from '../components/Tables/PendingDepositTable';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { URL } from '../types/constant';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import Loader from '../common/Loader';

const PendingDeposit = () => {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [walletAddressCheck, setWalletAddressCheck] = useState("");
  const [accessToken, setAccessToken] = useState('');
  const [listUnCollect, setListUnCollect] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token === null || token === '') {
      window.location.href = '/auth/signin';
    } else {
      setAccessToken(token); // Here, token is guaranteed to be a string.
    }
  }, []);

  const logout = () => {
    let config = {
      method: 'get',
      url: `${URL}auth/logout/${accessToken}`, // Adjusted URL
      headers: {
        'ngrok-skip-browser-warning': '69420',
      },
    };
  
    Axios.request(config)
      .then(() => {
        localStorage.removeItem('access_token'); // Clear access token
        window.location.href = '/auth/signin';   // Redirect to signin on success
      })
      .catch(() => {
        localStorage.removeItem('access_token'); // Clear access token on error as well
        window.location.href = '/auth/signin';   // Redirect to signin on error
      });
  };
  
  useEffect(() => {
    setLoading(true);
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
      });

    setLoading(false);
  }, [accessToken]);

  const handleCollectAll = () => {};

  const handleCollectWallet = (walletAddress: string) => {
    if (buttonDisabled) return;
    if (walletAddress === null || walletAddress === '') {
      return;
    }

    Swal.fire({
      title: 'Confirm collect wallet',
      text: `Are you sure you want to collect`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, transfer it!',
      cancelButtonText: 'No, cancel',
      reverseButtons: true,
      customClass: {
        confirmButton: 'custom-confirm-button', // Custom class for confirm button
        cancelButton: 'custom-cancel-button', // Custom class for cancel button
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        setButtonDisabled(true);
        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: `${URL}admin/pending-deposit/${walletAddress}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            'ngrok-skip-browser-warning': '69420',
          },
        };

        Axios.request(config)
          .then((response) => {
            if (response.data === 'ok') {
              setButtonDisabled(true);

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
              setButtonDisabled(false);

              toast.error(response.data, {
                position: 'top-right',
                autoClose: 3000,
              });
            }
          })
          .catch((error) => {
            setButtonDisabled(false);

            toast.error('Failed when collect', {
              position: 'top-right',
              autoClose: 3000,
            });
          });
      }
    });
  };

  const checkDeposit = () => {
    if (walletAddressCheck === null || walletAddressCheck === "") {
      return;
    }

    Swal.fire({
      title: 'Confirm check deposit of this wallet',
      text: `Are you sure you want to collect`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, confirm it!',
      cancelButtonText: 'No, cancel',
      reverseButtons: true,
      customClass: {
        confirmButton: 'custom-confirm-button', // Custom class for confirm button
        cancelButton: 'custom-cancel-button', // Custom class for cancel button
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        setButtonDisabled(true);

        let data = JSON.stringify({
          "walletAddress": walletAddressCheck
        });

        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: `${URL}admin/check-deposit`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            'ngrok-skip-browser-warning': '69420',
          },
          data: data
        };

        Axios.request(config)
          .then((response) => {
            if (response.data === "Deposit check processing, result will be sent to telegram!") {
              setButtonDisabled(true);

              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: `${response.data}`,
                showConfirmButton: false,
                timer: 1500,
              }).then(() => {
                window.location.reload();
              });
            } else {
              setButtonDisabled(true);

              Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: `${response.data}`,
                showConfirmButton: false,
                timer: 1500,
              });
            }
          })
          .catch((error) => {
            setButtonDisabled(false);

            toast.error('Failed when check deposit', {
              position: 'top-right',
              autoClose: 1500,
            });
          });
      }
    });
  };

  return (
    <>
      <Breadcrumb pageName="Pending Deposit" />
      <div className="p-7">
        <div className="mb-5.5 flex flex-col sm:flex-row gap-5.5">
          <div className="w-full sm:w-1/3">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="walletAddress"
            >
              Wallet Address
            </label>
            <div className="relative">
              <input
                className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                type="text"
                name="walletAddress"
                id="walletAddress"
                value={walletAddressCheck}
                onChange={(e) => {setWalletAddressCheck(e.target.value)}}
                placeholder="Wallet address need to check (internal wallet address)"
              />
            </div>
          </div>

          <div className="w-full sm:w-1/6 flex items-end mb-2">
            <button
              className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-70"
              onClick={checkDeposit}
            >
              Check deposit
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {loading ? (
          <Loader />
        ) : (
          <PendingDepositTable
            data={listUnCollect}
            handleCollect={handleCollectWallet}
          />
        )}
      </div>
    </>
  );
};

export default PendingDeposit;
