import React, { useState } from 'react';
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { URL } from '../../types/constant';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

type User = {
  walletAddress: string;
  displayName: string | null; // Adjusted to allow null
  rootId: string;
  sales: number;
  teamsales: number;
  leftRef: string;
  rightRef: string;
  rank: number;
  binaryRank: number;
  directRank: number;
  leaderRank: number;
  maxOut: number;
  lock: boolean;
  lockTransaction: boolean;
  lockWithdraw: boolean;
};

interface UserTableProps {
  data: User[];
  currentPage?: number;
  totalPage?: number;
  searchTerm: string; // Nhận searchTerm từ props
  onSearchChange: (term: string) => void; // Nhận hàm để thay đổi searchTerm
  onPageChange: (newPage: number) => void; // Function to handle page change
}

const UserTable: React.FC<UserTableProps> = ({
  data,
  currentPage = 0,
  totalPage = 0,
  onPageChange,
  searchTerm,
  onSearchChange,
}) => {
  const [accessToken] = useState(localStorage.getItem('access_token'));

  const [page, setPage] = useState(currentPage);

  const handlePrev = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPage - 1) {
      onPageChange(currentPage + 1);
    }
  };

  const handleUserPage = (userWallet: string) => {
    if (userWallet === null || userWallet === '') {
      return;
    }

    window.location.href = `/user/${userWallet}`;
  };

  const handleUserInfo = (userWallet: string) => {
    if (userWallet === null || userWallet === '') {
      return;
    }

    window.location.href = `/user-info/${userWallet}`;
  };

  const pageNumbers = Array.from(
    { length: Math.min(5, totalPage) },
    (_, index) => {
      const startPage = Math.max(0, currentPage - 2); // Start at currentPage - 2
      return startPage + index; // Generate page numbers based on the starting point
    },
  ).filter((page) => page < totalPage); // Ensure no out-of-bound pages

  const handleToggle = (userWalletAddress: string) => {
    if (userWalletAddress === null || userWalletAddress === '') {
      return;
    }

    let config = {
      method: 'get',
      url: `${URL}admin/lock/${userWalletAddress}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
    };

    Axios.request(config)
      .then((response) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Toggle status success',
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          window.location.reload();
        });
      })
      .catch((error) => {
        toast.error(error, {
          position: 'top-right',
          autoClose: 1500,
        });
      });
  };

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const handleToggleTransaction = (userWalletAddress: string) => {
    if (userWalletAddress === null || userWalletAddress === '') {
      return;
    }

    let config = {
      method: 'get',
      url: `${URL}admin/lock-transaction/${userWalletAddress}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
    };

    Axios.request(config)
      .then(() => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Toggle transfer status success',
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          window.location.reload();
        });
      })
      .catch((error) => {
        toast.error(error, {
          position: 'top-right',
          autoClose: 1500,
        });
      });
  };

  const handleToggleWithdraw = (userWalletAddress: string) => {
    if (userWalletAddress === null || userWalletAddress === '') {
      return;
    }

    let config = {
      method: 'get',
      url: `${URL}admin/lock-withdraw/${userWalletAddress}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
    };

    Axios.request(config)
      .then(() => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Toggle withdraw status success',
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          window.location.reload();
        });
      })
      .catch((error) => {
        toast.error(error, {
          position: 'top-right',
          autoClose: 1500,
        });
      });
  };

  const handleToggleStaking = (walletAddress: string) => {
    let config = {
      method: 'get',
      url: `${URL}admin/end-stake/${walletAddress}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
    };

    Axios.request(config)
      .then(() => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'End staking success',
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          window.location.reload();
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const copyToClipboard = (wallet: string) => {
    navigator.clipboard
      .writeText(wallet)
      .then(() => {
        toast.success('Wallet address copied to clipboard', {
          position: 'top-right',
          autoClose: 1500,
        });
      })
      .catch((err) => {
        toast.error(err, {
          position: 'top-right',
          autoClose: 1500,
        });
      });
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <input
        type="text"
        placeholder="Search by Wallet Address or Display Name"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="mb-4 w-full p-2 border border-gray-300 rounded"
      />
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Wallet Address
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Display Name
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Sales
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Rank
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Transfer
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Withdraw
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Staking
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, idx) => (
              <tr key={idx}>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p
                    className="text-black dark:text-white"
                    onClick={() => {
                      copyToClipboard(user.walletAddress);
                    }}
                  >
                    {truncateAddress(user.walletAddress)}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {user.displayName || 'N/A'} {/* Handle null displayName */}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{user.sales}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{user.rank}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p
                    className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                      user.lock === false
                        ? 'bg-success text-success'
                        : 'bg-danger text-danger'
                    }`}
                  >
                    {user.lock === false ? 'Unlocked' : 'Locked'}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p
                    className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                      user.lockTransaction === false
                        ? 'bg-success text-success'
                        : 'bg-danger text-danger'
                    }`}
                  >
                    {user.lockTransaction === false ? 'Unlocked' : 'Locked'}
                    <button
                      className="hover:text-primary"
                      onClick={() => {
                        handleToggleTransaction(user.walletAddress);
                      }}
                    >
                      {/* Transaction Lock Icon */}
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 2C8.69 2 6 4.69 6 8v4H4v8h16v-8h-2V8c0-3.31-2.69-6-6-6zm4 10v6H8v-6h8zm-4-8c2.21 0 4 1.79 4 4v4H8V8c0-2.21 1.79-4 4-4z"
                          fill=""
                        />
                      </svg>
                    </button>
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p
                    className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                      user.lockWithdraw === false
                        ? 'bg-success text-success'
                        : 'bg-danger text-danger'
                    }`}
                  >
                    {user.lockWithdraw === false ? 'Unlocked' : 'Locked'}
                    <button
                      className="hover:text-primary"
                      onClick={() => {
                        handleToggleWithdraw(user.walletAddress);
                      }}
                    >
                      {/* Transaction Lock Icon */}
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 2C8.69 2 6 4.69 6 8v4H4v8h16v-8h-2V8c0-3.31-2.69-6-6-6zm4 10v6H8v-6h8zm-4-8c2.21 0 4 1.79 4 4v4H8V8c0-2.21 1.79-4 4-4z"
                          fill=""
                        />
                      </svg>
                    </button>
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p
                    className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${'bg-danger text-danger'}`}
                  >
                    <button
                      className="hover:text-primary"
                      onClick={() => {
                        handleToggleStaking(user.walletAddress);
                      }}
                    >
                      {/* Transaction Lock Icon */}
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="4"
                          y="4"
                          width="16"
                          height="16"
                          fill="#f00"
                          rx="2"
                        />
                      </svg>
                    </button>
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <a
                      className="hover:text-primary"
                      href={`https://mapchain.org/admin/home/${user.walletAddress}`}
                      target="_blank"
                    >
                      {/* Login Icon */}
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15 8.5V10h-4v4h4v1.5c0 .83-.67 1.5-1.5 1.5h-7c-.83 0-1.5-.67-1.5-1.5v-1.5H4v-4h2V8.5c0-.83.67-1.5 1.5-1.5h7c.83 0 1.5.67 1.5 1.5zM21 12c0 4.41-3.59 8-8 8s-8-3.59-8-8h2c0 3.31 2.69 6 6 6s6-2.69 6-6h2z"
                          fill=""
                        />
                      </svg>
                    </a>

                    <button className="hover:text-primary"
                      onClick={() => handleUserInfo(user.walletAddress)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="15"
                        height="15"
                        viewBox="0 0 48 48"
                      >
                        <linearGradient
                          id="Z3eIuf5QY2EetuA~FfDd6a_VQOfeAx5KWTK_gr1"
                          x1="9.899"
                          x2="38.183"
                          y1="9.98"
                          y2="38.264"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0" stop-color="#33bef0"></stop>
                          <stop offset="1" stop-color="#0a85d9"></stop>
                        </linearGradient>
                        <path
                          fill="url(#Z3eIuf5QY2EetuA~FfDd6a_VQOfeAx5KWTK_gr1)"
                          d="M44.041,24.122c0,11.045-8.955,20-20,20s-20-8.955-20-20s8.955-20,20-20	S44.041,13.077,44.041,24.122z"
                        ></path>
                        <path
                          d="M22,36h4c0.552,0,1-0.448,1-1V20c0-0.552-0.448-1-1-1h-4c-0.552,0-1,0.448-1,1v15	C21,35.552,21.448,36,22,36z"
                          opacity=".05"
                        ></path>
                        <path
                          d="M22.227,35.5h3.547c0.401,0,0.727-0.325,0.727-0.727V20.227c0-0.401-0.325-0.727-0.727-0.727h-3.547	c-0.401,0-0.727,0.325-0.727,0.727v14.547C21.5,35.175,21.825,35.5,22.227,35.5z"
                          opacity=".07"
                        ></path>
                        <radialGradient
                          id="Z3eIuf5QY2EetuA~FfDd6b_VQOfeAx5KWTK_gr2"
                          cx="24"
                          cy="16"
                          r="5.108"
                          gradientTransform="matrix(.7808 0 0 .7066 5.26 4.096)"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset=".516"></stop>
                          <stop offset="1" stop-opacity="0"></stop>
                        </radialGradient>
                        <ellipse
                          cx="24"
                          cy="15.402"
                          fill="url(#Z3eIuf5QY2EetuA~FfDd6b_VQOfeAx5KWTK_gr2)"
                          opacity=".15"
                          rx="3.988"
                          ry="3.609"
                        ></ellipse>
                        <path
                          fill="#fff"
                          d="M24,17.732c1.7,0,2.65-1.068,2.65-2.388C26.65,14.024,25.647,13,24,13s-2.65,1.024-2.65,2.344	C21.35,16.664,22.3,17.732,24,17.732z"
                        ></path>
                        <rect
                          width="4"
                          height="15"
                          x="22"
                          y="20"
                          fill="#fff"
                        ></rect>
                      </svg>
                    </button>

                    {/* Eye Icon */}
                    <button
                      className="hover:text-primary"
                      onClick={() => handleUserPage(user.walletAddress)}
                    >
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 6C8.13 6 5.36 9 3.34 12c2.02 3 4.76 6 8.66 6 4.87 0 7.62-3 9.66-6C19.62 9 16.87 6 12 6zm0 10c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"
                          fill=""
                        />
                      </svg>
                    </button>

                    {/* Lock Icon */}

                    {/* Lock Icon */}
                    <button
                      className="hover:text-primary"
                      onClick={() => {
                        handleToggle(user.walletAddress);
                      }}
                    >
                      {/* Account Lock Icon */}
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 1a6 6 0 00-6 6v5H5a3 3 0 00-3 3v5a3 3 0 003 3h14a3 3 0 003-3v-5a3 3 0 00-3-3h-1V7a6 6 0 00-6-6zm3 11H9V7a3 3 0 116 0v5z"
                          fill=""
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center">
        <button
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === 0 ? 'bg-gray-300' : 'bg-gray-300 text-black'
          }`}
          onClick={handlePrev}
          disabled={currentPage === 0}
        >
          Prev
        </button>

        {pageNumbers.map((pageIndex) => (
          <button
            key={pageIndex}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === pageIndex
                ? 'bg-blue-500 text-white'
                : 'bg-gray-300'
            }`}
            onClick={() => onPageChange(pageIndex)}
          >
            {pageIndex + 1}
          </button>
        ))}

        <button
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === totalPage - 1
              ? 'bg-gray-300'
              : 'bg-gray-300 text-black'
          }`}
          onClick={handleNext}
          disabled={currentPage === totalPage - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserTable;
