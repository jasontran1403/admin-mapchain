import { useState, useEffect } from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { URL } from '../types/constant';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import Loader from '../common/Loader';

const UserInfo = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [usdtAddress, setUsdtAddress] = useState('');
  const [tonAddress, setTonAddress] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [usdtBalance, setUsdtBalance] = useState(0);
  const [mctBalance, setMctBalance] = useState(0);
  const [mctTransferBalance, setMctTransferBalance] = useState(0);
  const [mctDailyBalance, setMctDailyBalance] = useState(0);
  const [mctDirectBalance, setMctDirectBalance] = useState(0);
  const [mctBinaryBalance, setMctBinaryBalance] = useState(0);
  const [mctLeaderBalance, setMctLeaderBalance] = useState(0);
  const [mctPopBalance, setMctPopBalance] = useState(0);
  const [tonBalance, setTonBalance] = useState(0);
  const [tonDailyBalance, setTonDailyBalance] = useState(0);
  const [tonDirectBalance, setTonDirectBalance] = useState(0);
  const [tonBinaryBalance, setTonBinaryBalance] = useState(0);
  const [tonLeaderBalance, setTonLeaderBalance] = useState(0);
  const [tonPopBalance, setTonPopBalance] = useState(0);
  
  // State mới để quản lý ô input đang active
  const [activeBalanceField, setActiveBalanceField] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [newBalance, setNewBalance] = useState(0);
  const [walletSource, setWalletSource] = useState(-1);

  const logout = () => {
    let config = {
      method: 'get',
      url: `${URL}auth/logout/${localStorage.getItem('access_token')}`,
      headers: {
        'ngrok-skip-browser-warning': '69420',
      },
    };

    Axios.request(config)
      .then(() => {
        localStorage.removeItem('access_token');
        window.location.href = '/auth/signin';
      })
      .catch(() => {
        localStorage.removeItem('access_token');
        window.location.href = '/auth/signin';
      });
  };

  useEffect(() => {
    setLoading(true);

    let config = {
      method: 'get',
      url: `${URL}admin/get-user-info/${id}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        'ngrok-skip-browser-warning': '69420',
      },
    };

    Axios.request(config)
      .then((response) => {
        setUsdtAddress(response.data.usdtAddress);
        setTonAddress(response.data.tonAddress);
        setDisplayName(response.data.displayName);
        setUsdtBalance(response.data.bepBalance);
        setMctTransferBalance(response.data.transferBalance);
        setTonBalance(response.data.tonBalance);
        setMctBalance(response.data.mapchainBalance);
        setMctDailyBalance(response.data.mctDailyBalance);
        setMctDirectBalance(response.data.mctDirectBalance);
        setMctBinaryBalance(response.data.mctBinaryBalance);
        setMctLeaderBalance(response.data.mctLeaderBalance);
        setMctPopBalance(response.data.mctPOPBalance);
        setTonDailyBalance(response.data.tonDailyBalance);
        setTonDirectBalance(response.data.tonDirectBalance);
        setTonBinaryBalance(response.data.tonBinaryBalance);
        setTonLeaderBalance(response.data.tonLeaderBalance);
        setTonPopBalance(response.data.tonPOPBalance);
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          window.location.href = '/users';
        }
      });

    setLoading(false);
  }, [id]);

  const handleBalanceFocus = (fieldName, initialValue, source) => {
    setActiveBalanceField(fieldName);
    setCurrentBalance(initialValue);
    setNewBalance(initialValue);
    setWalletSource(source);
  };

  const handleBalanceChange = (fieldName, value, setter) => {
    setNewBalance(value);
    setter(value);
  };

  const isBalanceFieldDisabled = (fieldName : string) => {
    return activeBalanceField !== null && activeBalanceField !== fieldName;
  };

  const handleUpdateBalance = () => {
    if (walletSource === -1 || activeBalanceField === null || currentBalance === newBalance || newBalance < 0) return;

    let data = JSON.stringify({
      walletAddress: id,
      currenctBalance: currentBalance,
      newBalance: newBalance,
      walletSource: walletSource,
    });

    let config = {
      method: 'post',
      url: `${URL}admin/update-user-balance`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        'ngrok-skip-browser-warning': '69420',
      },
      data: data,
    };

    Axios.request(config)
      .then((response) => {
        if (response.data.includes('successful, ')) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Update user balance successful',
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
              setActiveBalanceField(null);
              window.location.reload();
            });
        } else {
          toast.error(response.data, {
            position: 'top-right',
            autoClose: 3000,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdateWallet = () => {
    if (usdtAddress === "" && tonAddress === "") return;

    let data = JSON.stringify({
      walletAddress: id,
      newBep: usdtAddress,
      newTon: tonAddress,
    });

    let config = {
      method: 'post',
      url: `${URL}admin/update-user-wallet`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        'ngrok-skip-browser-warning': '69420',
      },
      data: data,
    };

    Axios.request(config)
      .then((response) => {
        if (response.data.includes(' successful.')) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Update user detail success',
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            window.location.reload();
          });
        } else {
          toast.error(response.data, {
            position: 'top-right',
            autoClose: 3000,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Settings" />

        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-5 gap-8">
            <div className="col-span-12 xl:col-span-12">
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                  <h3 className="font-medium text-black dark:text-white">
                    Personal Information
                  </h3>
                </div>
                <div className="p-7">
                  <div>
                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                      <div className="w-full">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="walletAddress"
                        >
                          Display Name
                        </label>
                        <div className="relative">
                          <input
                            className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="walletAddress"
                            id="walletAddress"
                            value={displayName}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="displayName"
                        >
                          USDT-BEP20
                        </label>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="displayName"
                          id="displayName"
                          value={usdtAddress}
                          onChange={(e) => setUsdtAddress(e.target.value)}
                        />
                      </div>

                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="walletAddress"
                        >
                          TON NETWORK
                        </label>
                        <div className="relative">
                          <input
                            className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="walletAddress"
                            id="walletAddress"
                            value={tonAddress}
                            onChange={(e) => setTonAddress(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                      <div className="w-full">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="displayName"
                        >
                          USDT-BEP20 Balance
                        </label>
                        <input
                          className={`w-full rounded border border-stroke py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:text-white dark:focus:border-primary ${
                            isBalanceFieldDisabled('usdtBalance') ? 'bg-gray-100 dark:bg-meta-4' : 'bg-gray dark:bg-meta-4'
                          }`}
                          type="number"
                          name="displayName"
                          id="displayName"
                          value={usdtBalance}
                          onChange={(e) => handleBalanceChange('usdtBalance', Number(e.target.value), setUsdtBalance)}
                          onFocus={() => handleBalanceFocus('usdtBalance', usdtBalance, 0)}
                          disabled={isBalanceFieldDisabled('usdtBalance')}
                        />
                      </div>
                    </div>

                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="displayName"
                        >
                          MCT Token
                        </label>
                        <input
                          className={`w-full rounded border border-stroke py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:text-white dark:focus:border-primary ${
                            isBalanceFieldDisabled('mctBalance') ? 'bg-gray-100 dark:bg-meta-4' : 'bg-gray dark:bg-meta-4'
                          }`}
                          type="number"
                          name="displayName"
                          id="displayName"
                          value={mctBalance}
                          onChange={(e) => handleBalanceChange('mctBalance', Number(e.target.value), setMctBalance)}
                          onFocus={() => handleBalanceFocus('mctBalance', mctBalance, 1)}
                          disabled={isBalanceFieldDisabled('mctBalance')}
                        />
                      </div>

                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="walletAddress"
                        >
                          MCT Transfer
                        </label>
                        <div className="relative">
                          <input
                            className={`w-full rounded border border-stroke py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:text-white dark:focus:border-primary ${
                              isBalanceFieldDisabled('mctTransferBalance') ? 'bg-gray-100 dark:bg-meta-4' : 'bg-gray dark:bg-meta-4'
                            }`}
                            type="number"
                            name="walletAddress"
                            id="walletAddress"
                            value={mctTransferBalance}
                            onChange={(e) => handleBalanceChange('mctTransferBalance', Number(e.target.value), setMctTransferBalance)}
                            onFocus={() => handleBalanceFocus('mctTransferBalance', mctTransferBalance, 2)}
                            disabled={isBalanceFieldDisabled('mctTransferBalance')}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="displayName"
                        >
                          MCT Daily Reward
                        </label>
                        <input
                          className={`w-full rounded border border-stroke py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:text-white dark:focus:border-primary ${
                            isBalanceFieldDisabled('mctDailyBalance') ? 'bg-gray-100 dark:bg-meta-4' : 'bg-gray dark:bg-meta-4'
                          }`}
                          type="number"
                          name="displayName"
                          id="displayName"
                          value={mctDailyBalance}
                          onChange={(e) => handleBalanceChange('mctDailyBalance', Number(e.target.value), setMctDailyBalance)}
                          onFocus={() => handleBalanceFocus('mctDailyBalance', mctDailyBalance, 3)}
                          disabled={isBalanceFieldDisabled('mctDailyBalance')}
                        />
                      </div>

                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="walletAddress"
                        >
                          MCT Direct Commission
                        </label>
                        <div className="relative">
                          <input
                            className={`w-full rounded border border-stroke py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:text-white dark:focus:border-primary ${
                              isBalanceFieldDisabled('mctDirectBalance') ? 'bg-gray-100 dark:bg-meta-4' : 'bg-gray dark:bg-meta-4'
                            }`}
                            type="number"
                            name="walletAddress"
                            id="walletAddress"
                            value={mctDirectBalance}
                            onChange={(e) => handleBalanceChange('mctDirectBalance', Number(e.target.value), setMctDirectBalance)}
                            onFocus={() => handleBalanceFocus('mctDirectBalance', mctDirectBalance, 4)}
                            disabled={isBalanceFieldDisabled('mctDirectBalance')}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="displayName"
                        >
                          MCT Binary Commission
                        </label>
                        <input
                          className={`w-full rounded border border-stroke py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:text-white dark:focus:border-primary ${
                            isBalanceFieldDisabled('mctBinaryBalance') ? 'bg-gray-100 dark:bg-meta-4' : 'bg-gray dark:bg-meta-4'
                          }`}
                          type="number"
                          name="displayName"
                          id="displayName"
                          value={mctBinaryBalance}
                          onChange={(e) => handleBalanceChange('mctBinaryBalance', Number(e.target.value), setMctBinaryBalance)}
                          onFocus={() => handleBalanceFocus('mctBinaryBalance', mctBinaryBalance, 5)}
                          disabled={isBalanceFieldDisabled('mctBinaryBalance')}
                        />
                      </div>

                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="walletAddress"
                        >
                          MCT Leader Commission
                        </label>
                        <div className="relative">
                          <input
                            className={`w-full rounded border border-stroke py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:text-white dark:focus:border-primary ${
                              isBalanceFieldDisabled('mctLeaderBalance') ? 'bg-gray-100 dark:bg-meta-4' : 'bg-gray dark:bg-meta-4'
                            }`}
                            type="number"
                            name="walletAddress"
                            id="walletAddress"
                            value={mctLeaderBalance}
                            onChange={(e) => handleBalanceChange('mctLeaderBalance', Number(e.target.value), setMctLeaderBalance)}
                            onFocus={() => handleBalanceFocus('mctLeaderBalance', mctLeaderBalance, 6)}
                            disabled={isBalanceFieldDisabled('mctLeaderBalance')}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="displayName"
                        >
                          MCT POP Commission
                        </label>
                        <input
                          className={`w-full rounded border border-stroke py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:text-white dark:focus:border-primary ${
                            isBalanceFieldDisabled('mctPopBalance') ? 'bg-gray-100 dark:bg-meta-4' : 'bg-gray dark:bg-meta-4'
                          }`}
                          type="number"
                          name="displayName"
                          id="displayName"
                          value={mctPopBalance}
                          onChange={(e) => handleBalanceChange('mctPopBalance', Number(e.target.value), setMctPopBalance)}
                          onFocus={() => handleBalanceFocus('mctPopBalance', mctPopBalance, 7)}
                          disabled={isBalanceFieldDisabled('mctPopBalance')}
                        />
                      </div>

                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="walletAddress"
                        >
                          Ton Balance
                        </label>
                        <div className="relative">
                          <input
                            className={`w-full rounded border border-stroke py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:text-white dark:focus:border-primary ${
                              isBalanceFieldDisabled('tonBalance') ? 'bg-gray-100 dark:bg-meta-4' : 'bg-gray dark:bg-meta-4'
                            }`}
                            type="number"
                            name="walletAddress"
                            id="walletAddress"
                            value={tonBalance}
                            onChange={(e) => handleBalanceChange('tonBalance', Number(e.target.value), setTonBalance)}
                            onFocus={() => handleBalanceFocus('tonBalance', tonBalance, 8)}
                            disabled={isBalanceFieldDisabled('tonBalance')}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="displayName"
                        >
                          Ton Daily Reward
                        </label>
                        <input
                          className={`w-full rounded border border-stroke py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:text-white dark:focus:border-primary ${
                            isBalanceFieldDisabled('tonDailyBalance') ? 'bg-gray-100 dark:bg-meta-4' : 'bg-gray dark:bg-meta-4'
                          }`}
                          type="number"
                          name="displayName"
                          id="displayName"
                          value={tonDailyBalance}
                          onChange={(e) => handleBalanceChange('tonDailyBalance', Number(e.target.value), setTonDailyBalance)}
                          onFocus={() => handleBalanceFocus('tonDailyBalance', tonDailyBalance, 9)}
                          disabled={isBalanceFieldDisabled('tonDailyBalance')}
                        />
                      </div>

                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="walletAddress"
                        >
                          Ton Direct Balance
                        </label>
                        <div className="relative">
                          <input
                            className={`w-full rounded border border-stroke py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:text-white dark:focus:border-primary ${
                              isBalanceFieldDisabled('tonDirectBalance') ? 'bg-gray-100 dark:bg-meta-4' : 'bg-gray dark:bg-meta-4'
                            }`}
                            type="number"
                            name="walletAddress"
                            id="walletAddress"
                            value={tonDirectBalance}
                            onChange={(e) => handleBalanceChange('tonDirectBalance', Number(e.target.value), setTonDirectBalance)}
                            onFocus={() => handleBalanceFocus('tonDirectBalance', tonDirectBalance, 10)}
                            disabled={isBalanceFieldDisabled('tonDirectBalance')}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="displayName"
                        >
                          Ton Binary Balance
                        </label>
                        <input
                          className={`w-full rounded border border-stroke py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:text-white dark:focus:border-primary ${
                            isBalanceFieldDisabled('tonBinaryBalance') ? 'bg-gray-100 dark:bg-meta-4' : 'bg-gray dark:bg-meta-4'
                          }`}
                          type="number"
                          name="displayName"
                          id="displayName"
                          value={tonBinaryBalance}
                          onChange={(e) => handleBalanceChange('tonBinaryBalance', Number(e.target.value), setTonBinaryBalance)}
                          onFocus={() => handleBalanceFocus('tonBinaryBalance', tonBinaryBalance, 11)}
                          disabled={isBalanceFieldDisabled('tonBinaryBalance')}
                        />
                      </div>

                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="walletAddress"
                        >
                          Ton Leader Balance
                        </label>
                        <div className="relative">
                          <input
                            className={`w-full rounded border border-stroke py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:text-white dark:focus:border-primary ${
                              isBalanceFieldDisabled('tonLeaderBalance') ? 'bg-gray-100 dark:bg-meta-4' : 'bg-gray dark:bg-meta-4'
                            }`}
                            type="number"
                            name="walletAddress"
                            id="walletAddress"
                            value={tonLeaderBalance}
                            onChange={(e) => handleBalanceChange('tonLeaderBalance', Number(e.target.value), setTonLeaderBalance)}
                            onFocus={() => handleBalanceFocus('tonLeaderBalance', tonLeaderBalance, 12)}
                            disabled={isBalanceFieldDisabled('tonLeaderBalance')}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                      <div className="w-full">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="displayName"
                        >
                          Ton Pop Balance
                        </label>
                        <input
                          className={`w-full rounded border border-stroke py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:text-white dark:focus:border-primary ${
                            isBalanceFieldDisabled('tonPopBalance') ? 'bg-gray-100 dark:bg-meta-4' : 'bg-gray dark:bg-meta-4'
                          }`}
                          type="number"
                          name="displayName"
                          id="displayName"
                          value={tonPopBalance}
                          onChange={(e) => handleBalanceChange('tonPopBalance', Number(e.target.value), setTonPopBalance)}
                          onFocus={() => handleBalanceFocus('tonPopBalance', tonPopBalance, 13)}
                          disabled={isBalanceFieldDisabled('tonPopBalance')}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4.5">
                      <button
                        className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                        type="submit"
                        onClick={() => {
                          window.location.href = '/users';
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-70"
                        onClick={handleUpdateWallet}
                      >
                        Update Wallet
                      </button>
                      <button
                        className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-70"
                        onClick={handleUpdateBalance}
                      >
                        Update Balanace
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default UserInfo;