import { useState, useEffect } from 'react';
import Axios from 'axios';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import TransactionTransfer from '../components/Tables/TransactionTransfer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { URL } from '../types/constant';
import Loader from '../common/Loader';

const TransferTable = () => {
  const [accessToken, setAccessToken] = useState('');
  const [adminWallet, setAdminWallet] = useState('');
  const [listTransfer, setListTransfer] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [formData, setFormData] = useState({
    walletAddress: '',
    amount: 0,
    type: '1', // Default to USDTBEP20
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const wallet = localStorage.getItem('wallet_address');
    if (token === null || token === '' || wallet === null || wallet === '') {
      window.location.href = '/auth/signin';
    } else {
      setAccessToken(token);
      setAdminWallet(wallet);
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
        window.location.href = '/auth/signin'; // Redirect to signin on success
      })
      .catch(() => {
        localStorage.removeItem('access_token'); // Clear access token on error as well
        window.location.href = '/auth/signin'; // Redirect to signin on error
      });
  };

  useEffect(() => {
    setLoading(true);
    let config = {
      method: 'get',
      url: `${URL}admin/transfer`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
    };

    Axios.request(config)
      .then((response) => {
        setListTransfer(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [accessToken]);

  const handleInputChange = (e: any) => {
    if (buttonDisabled) return;
    const { name, value } = e.target;

    if (name === 'amount') {
      const numericValue = Number(value);
      if (isNaN(numericValue) || numericValue < 0) {
        setFormData((prevData) => ({
          ...prevData,
          amount: '',
        }));
        return;
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTransfer = () => {
    const { walletAddress, amount, type } = formData;

    if (!walletAddress || amount <= 0 || !type) {
      alert(
        'Please fill in all fields and ensure amount is greater than zero.',
      );
      return;
    }

    // Show SweetAlert2 confirmation modal
    Swal.fire({
      title: 'Confirm Transfer',
      text: `Are you sure you want to transfer ${amount} to ${walletAddress}?`,
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
        // Disable the transfer button
        setButtonDisabled(true);

        let data = JSON.stringify({
          from: adminWallet,
          toWalletAddress: formData.walletAddress,
          amount: formData.amount,
          type: formData.type,
        });

        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: `${URL}admin/admin-transfer`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            'ngrok-skip-browser-warning': '69420',
          },
          data: data,
        };

        Axios.request(config)
          .then((response) => {
            setButtonDisabled(true);
            if (response.data === 'Transfer success') {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: response.data,
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
              // Re-enable the button if the transfer fails
            }
          })
          .catch((error) => {
            // console.log(error);
            toast.error('An error occurred. Please try again.', {
              position: 'top-right',
              autoClose: 3000,
            });
            // Re-enable the button if there is an error
            setButtonDisabled(false);
          });
      }
    });
  };

  return (
    <>
      <Breadcrumb pageName="Transfer transactions" />
      <div className="p-7">
        <div className="mb-5.5 flex flex-col sm:flex-row gap-5.5">
          <div className="w-full sm:w-1/3">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="walletAddress"
            >
              To Wallet Address
            </label>
            <div className="relative">
              <input
                className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                type="text"
                name="walletAddress"
                id="walletAddress"
                value={formData.walletAddress}
                onChange={handleInputChange}
                placeholder="Transfer to wallet address"
              />
            </div>
          </div>

          <div className="w-full sm:w-1/3">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="amount"
            >
              Amount
            </label>
            <input
              className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              type="number"
              name="amount"
              id="amount"
              value={formData.amount}
              onChange={handleInputChange}
              min="0"
            />
          </div>

          <div className="w-full sm:w-1/3">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="type"
            >
              Type
            </label>
            <select
              name="type"
              id="type"
              className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              value={formData.type}
              onChange={handleInputChange}
            >
              <option value="2">MCT</option>
            </select>
          </div>

          <div className="w-full sm:w-1/6 flex items-end mb-2">
            <button
              className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-70"
              onClick={handleTransfer}
            >
              Transfer
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {loading ? <Loader /> : <TransactionTransfer data={listTransfer} />}
      </div>
    </>
  );
};

export default TransferTable;
