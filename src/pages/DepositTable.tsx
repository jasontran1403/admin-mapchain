import { useState, useEffect } from 'react';
import Axios from 'axios';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import TransactionDeposit from '../components/Tables/TransactionDeposit';
import { URL } from "../types/constant";
import Loader from '../common/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DepositTable = () => {
  const [accessToken, setAccessToken] = useState('');
  const [listDeposit, setListDeposit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalDeposit, setTotalDeposit] = useState("");
  const [selectedType, setSelectedType] = useState("USDT");
  const [startDate, setStartDate] = useState(""); // Ngày bắt đầu
  const [endDate, setEndDate] = useState(""); // Ngày kết thúc

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      window.location.href = '/auth/signin';
    } else {
      setAccessToken(token);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    let config = {
      method: 'get',
      url: `${URL}admin/deposit`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "ngrok-skip-browser-warning": "69420",
      },
    };

    Axios.request(config)
      .then((response) => {
        setListDeposit(response.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [accessToken]);

  const handleCalculateDeposit = () => {
    if (!startDate || !endDate) {
      toast.error("Please select start and end dates", { autoClose: 1500 });
      return;
    }

    if (searchTerm === "") {
      return;
    }

    // Chuyển đổi sang dạng Date object để so sánh
    let start = new Date(startDate);
    let end = new Date(endDate);

    if (start > end) {
      end = start; // Nếu ngày bắt đầu > ngày kết thúc, cập nhật ngày kết thúc bằng ngày bắt đầu
      setEndDate(startDate);
    }

    let startDateValue = start.toISOString().split("T")[0] + "T00:00:00"; // YYYY-MM-DDT00:00:00
    let endDateValue = end.toISOString().split("T")[0] + "T23:59:59"; // YYYY-MM-DDT23:59:59

    let config = {
      method: 'get',
      url: `${URL}admin/all-system-deposit/${searchTerm}/${selectedType}/${startDateValue}/${endDateValue}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
    };

    Axios.request(config)
      .then((response) => {
        if (response.data === "This id is not existed!") {
          toast.error(response.data, {
            autoClose: 1500,
            onClose: () => setTotalDeposit(""),
          });
        } else {
          toast.success("Fetch data success", {
            autoClose: 1500,
            onClose: () => setTotalDeposit(response.data),
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Breadcrumb pageName="Deposit transactions" />
      <div className="p-7">
        <div className="mb-5.5 flex flex-col sm:flex-row gap-5.5">
          {/* Ô nhập địa chỉ ví */}
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Wallet Address
            </label>
            <input
              type="text"
              className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Fetch data by wallet address or display name"
            />
          </div>

          {/* Ô chọn loại tiền */}
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Type
            </label>
            <select
              className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="USDT">USDT</option>
              <option value="MCT">MCT</option>
            </select>
          </div>
        </div>
        <div className="mb-5.5 flex flex-col sm:flex-row gap-5.5">
          {/* Ô chọn ngày bắt đầu */}
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Start Date
            </label>
            <input
              type="date"
              className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* Ô chọn ngày kết thúc */}
          <div className="w-full sm:w-1/2">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              End Date
            </label>
            <input
              type="date"
              className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Nút Fetch Data */}

        </div>
        <div className="w-full sm:w-1 flex items-end mb-2">
          <button
            className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-70"
            onClick={handleCalculateDeposit}
          >
            Fetch Data
          </button>
        </div>

        {/* Hiển thị tổng deposit */}
        {totalDeposit.length > 0 && (
          <div className="w-full">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Total Deposit
            </label>
            <input
              type="text"
              className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              value={totalDeposit}
              readOnly
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-10">
        {loading ? <Loader /> : <TransactionDeposit data={listDeposit} />}
      </div>
    </>
  );
};

export default DepositTable;
