import { useState, useEffect } from 'react';
import Axios from 'axios';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { URL } from '../types/constant';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import Loader from '../common/Loader';

const AdminInfo = () => {
  const [accessToken, setAccessToken] = useState('');
  const [bscPrivateKey, setBscPrivateKey] = useState('');
  const [mnemonics, setMnemonics] = useState('');
  const [tonWallet, setTonWallet] = useState('');
  const [mctPrice, setMctPrice] = useState(0);
  const [fetchMCT, setFetchMCT] = useState(0);
  const [bnbBalance, setBnbBalance] = useState(0);
  const [usdtBalance, setUsdtBalance] = useState(0);
  const [walletAddress, setWalletAddress] = useState('');
  const [xrpPublicKey, setXrpPublicKey] = useState('');
  const [xrpPrivateKey, setXrpPrivateKey] = useState('');
  const [xrpWalletAddress, setXrpWalletAddress] = useState('');
  const [xrpBalance, setXrpBalance] = useState(0);

  const [kaspaWalletAddress, setKaspaWalletAddress] = useState('');
  const [kaspaPrivateKey, setKaspaPrivateKey] = useState('');
  const [kaspaBalance, setKaspaBalance] = useState(0);

  const [ethWalletAddress, setEthWalletAddress] = useState('');
  const [ethPrivateKey, setEthPrivateKey] = useState('');
  const [ethBalance, setEthBalance] = useState(0);

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
      url: `${URL}admin/admin-tool`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
    };

    Axios.request(config)
      .then((response) => {
        setBscPrivateKey(response.data.privateKey);
        setMctPrice(response.data.price);
        setBnbBalance(response.data.bnbBalance);
        setUsdtBalance(response.data.usdtBalance);
        setTonWallet(response.data.tonWallet);
        setMnemonics(response.data.mnemonics);
        setWalletAddress(response.data.walletAddress);
        setXrpPublicKey(response.data.xrpPublicKey);
        setXrpPrivateKey(response.data.xrpPrivateKey);
        setXrpWalletAddress(response.data.xrpWalletAddress);
        setXrpBalance(response.data.xrpBalance);
        setKaspaWalletAddress(response.data.kaspaWalletAddress);
        setKaspaPrivateKey(response.data.kaspaMnemonics);
        setKaspaBalance(response.data.kaspaBalance);
        setEthWalletAddress(response.data.ethWalletAddress);
        setEthPrivateKey(response.data.ethMnemonics);
        setEthBalance(response.data.ethBalance);
        setFetchMCT(response.data.fetchMCT);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  }, [accessToken]);

  const handleUpdate = () => {
    if (isNaN(mctPrice) || mctPrice <= 0) {
      return;
    }

    let data = JSON.stringify({
      privateKey: bscPrivateKey,
      walletAddress: walletAddress,
      mnemonics: mnemonics,
      tonWallet: tonWallet,
      xrpWalletAddress: xrpWalletAddress,
      xrpPublicKey: xrpPublicKey,
      xrpPrivateKey: xrpPrivateKey,
      price: mctPrice,
      fetchMCT: fetchMCT,
      kaspaWalletAddress: kaspaWalletAddress,
      kaspaMnemonics: kaspaPrivateKey,
      ethWalletAddress: ethWalletAddress,
      ethMnemonics: ethPrivateKey
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${URL}admin/update-admin-tool`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
      data: data,
    };

    Axios.request(config)
      .then((response) => {
        if (response.data === 'ok') {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Update info success',
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
                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="walletAddress"
                        >
                          Ton Mnemonics
                        </label>
                        <div className="relative">
                          <input
                            className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="walletAddress"
                            id="walletAddress"
                            value={mnemonics}
                            onChange={(e) => {
                              setMnemonics(e.target.value);
                            }}
                          />
                        </div>
                      </div>

                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="displayName"
                        >
                          Ton wallet address
                        </label>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="displayName"
                          id="displayName"
                          value={tonWallet}
                          onChange={(e) => {
                            setTonWallet(e.target.value);
                          }}
                        />
                      </div>
                    </div>

                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="walletAddress"
                        >
                          BSC Wallet PrivateKey
                        </label>
                        <div className="relative">
                          <input
                            className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="walletAddress"
                            id="walletAddress"
                            value={bscPrivateKey}
                            onChange={(e) => {
                              setBscPrivateKey(e.target.value);
                            }}
                          />
                        </div>
                      </div>

                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="displayName"
                        >
                          Wallet address BSC
                        </label>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="displayName"
                          id="displayName"
                          value={walletAddress}
                          onChange={(e) => {
                            setWalletAddress(e.target.value);
                          }}
                        />
                      </div>
                    </div>

                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="displayName"
                        >
                          MCT Price
                        </label>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="number"
                          name="displayName"
                          id="displayName"
                          value={mctPrice}
                          onChange={(e) => {
                            setMctPrice(Number(e.target.value));
                          }}
                        />
                      </div>
                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="realtimePrice"
                        >
                          Enable Realtime Price
                        </label>
                        <select
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          name="realtimePrice"
                          id="realtimePrice"
                          value={fetchMCT}
                          onChange={(e) => {
                            setFetchMCT(Number(e.target.value));
                          }}
                        >
                          <option value={0}>Off</option>
                          <option value={1}>On</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="walletAddress"
                        >
                          BNB Balance
                        </label>
                        <div className="relative">
                          <input
                            className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="walletAddress"
                            id="walletAddress"
                            value={bnbBalance}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="displayName"
                        >
                          USDT Balance
                        </label>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="displayName"
                          id="displayName"
                          value={usdtBalance}
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="walletAddress"
                        >
                          XRP WalletAddress
                        </label>
                        <div className="relative">
                          <input
                            className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="walletAddress"
                            id="walletAddress"
                            value={xrpWalletAddress}
                            onChange={(e) => {
                              setXrpWalletAddress(e.target.value);
                            }}
                          />
                        </div>
                      </div>

                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="displayName"
                        >
                          XRP PrivateKey
                        </label>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="displayName"
                          id="displayName"
                          value={xrpPrivateKey}
                          onChange={(e) => {
                            setXrpPrivateKey(e.target.value);
                          }}
                        />
                      </div>
                    </div>

                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                      <div className="w-full">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="displayName"
                        >
                          XRP Balance
                        </label>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="displayName"
                          id="displayName"
                          value={xrpBalance}
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="walletAddress"
                        >
                          Kaspa WalletAddress
                        </label>
                        <div className="relative">
                          <input
                            className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="walletAddress"
                            id="walletAddress"
                            value={kaspaWalletAddress}
                            onChange={(e) => {
                              setKaspaWalletAddress(e.target.value);
                            }}
                          />
                        </div>
                      </div>

                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="displayName"
                        >
                          Kaspa PrivateKey
                        </label>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="displayName"
                          id="displayName"
                          value={kaspaPrivateKey}
                          onChange={(e) => {
                            setKaspaPrivateKey(e.target.value);
                          }}
                        />
                      </div>
                    </div>

                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                      <div className="w-full">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="displayName"
                        >
                          Kaspa Balance
                        </label>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="displayName"
                          id="displayName"
                          value={kaspaBalance}
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="walletAddress"
                        >
                          ETH WalletAddress
                        </label>
                        <div className="relative">
                          <input
                            className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="walletAddress"
                            id="walletAddress"
                            value={ethWalletAddress}
                            onChange={(e) => {
                              setEthWalletAddress(e.target.value);
                            }}
                          />
                        </div>
                      </div>

                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="displayName"
                        >
                          ETH PrivateKey
                        </label>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="displayName"
                          id="displayName"
                          value={ethPrivateKey}
                          onChange={(e) => {
                            setEthPrivateKey(e.target.value);
                          }}
                        />
                      </div>
                    </div>

                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                      <div className="w-full">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="displayName"
                        >
                          ETH Balance
                        </label>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="displayName"
                          id="displayName"
                          value={ethBalance}
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4.5">
                      <button className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white">
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdate}
                        className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-70"
                      >
                        Save
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

export default AdminInfo;
