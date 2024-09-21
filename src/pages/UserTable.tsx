import { useState, useEffect } from 'react';
import Axios from "axios";
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import UsersTable from '../components/Tables/UserTable';
import { URL } from "../types/constant";

const UserTable = () => {
  const [accessToken, setAccessToken] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token === null || token === '') {
      window.location.href = '/auth/signin';
    } else {
      setAccessToken(token); // Here, token is guaranteed to be a string.
    }
  }, []);

  useEffect(() => {
    if (accessToken === null || accessToken === '') return;
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
      
    })
    .catch((error) => {
      console.log(error);
    });
  }, [accessToken]);
  
  return (
    <>
      <Breadcrumb pageName="Users table" />

      <div className="flex flex-col gap-10">
        <UsersTable data={users}/>
      </div>
    </>
  );
};

export default UserTable;
