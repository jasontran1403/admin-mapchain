import { useState, useEffect } from 'react';
import Axios from "axios";
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import UsersTable from '../components/Tables/UserTable';
import { URL } from "../types/constant";
import Loader from '../common/Loader';

const UserTable = () => {
  const [accessToken, setAccessToken] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state

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
    if (accessToken === null || accessToken === '') return;

    setLoading(true); // Start loading when API request is triggered

    let config = {
      method: 'get',
      url: `${URL}admin/users`,
      headers: { 
        'Authorization': `Bearer ${accessToken}`,
        "ngrok-skip-browser-warning": "69420",
      }
    };
    
    Axios.request(config)
    .then((response) => {
      setUsers(response.data);
      console.log(response.data);
      setLoading(false); // End loading on success
    })
    .catch((error) => {
      console.log(error);
      setLoading(false); // End loading on error
    });
  }, [accessToken]);

  return (
    <>
      <Breadcrumb pageName="Users table" />

      <div className="flex flex-col gap-10">
        {loading ? ( // Show spinner while loading
          <Loader /> // Replace this with your actual spinner component
        ) : (
          <UsersTable data={users}/>
        )}
      </div>
    </>
  );
};

export default UserTable;
