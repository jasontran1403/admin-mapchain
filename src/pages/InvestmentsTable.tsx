import { useState, useEffect } from 'react';
import Axios from "axios";
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InvestmentTable from '../components/Tables/InvestmentTable';
import { URL } from "../types/constant";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

const InvestmentsTable = () => {
  const [accessToken, setAccessToken] = useState('');
  const [listInvestment, setListInvestment] = useState([]);

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
      url: `${URL}admin/investments`,
      headers: { 
        'Authorization': `Bearer ${accessToken}`,
        "ngrok-skip-browser-warning": "69420",
      }
    };
    
    Axios.request(config)
    .then((response) => {
      setListInvestment(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
    
  }, [accessToken]);

  const handlePayDaily = () => {
    let config = {
      method: 'get',
      url: `${URL}admin/pay-daily`,
      headers: {
        Authorization:
          `Bearer ${accessToken}`,
          "ngrok-skip-browser-warning": "69420",
      },
    };

    Axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        if (response.data === "ok") {
          // toast.success('Daily reward pay success!', {
          //   position: 'top-right',
          //   autoClose: 3000,
          //   onClick: () => {
          //     window.location.reload();
          //   },
          // });
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Daily reward pay success',
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            window.location.reload();
          });
        } 
      })
      .catch((error) => {
        console.log(error);
        toast.error(error, {
          position: 'top-right',
          autoClose: 1500,
        });
      });
  };

  return (
    <>
      <Breadcrumb pageName="Investments table" />
      <div className="p-4 md:p-6 xl:p-9">
        <div className="flex flex-wrap gap-5 xl:gap-20">
          <Link
            to="#"
            onClick={handlePayDaily}
            className="inline-flex items-center justify-center rounded-md border border-primary py-4 px-10 text-center font-medium text-primary hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            Pay daily
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-10">
        <InvestmentTable data={listInvestment} />
      </div>
      <ToastContainer />
    </>
  );
};

export default InvestmentsTable;
