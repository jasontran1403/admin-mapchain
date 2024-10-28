import { useState, useEffect } from 'react';
import Axios from 'axios';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import UsersTable from '../components/Tables/UserTable';
import { URL } from '../types/constant';
import Loader from '../common/Loader';

const UserTable = () => {
  const [accessToken, setAccessToken] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState(''); // Trạng thái cho từ khóa tìm kiếm
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null); // State cho timeout

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
        window.location.href = '/auth/signin'; // Redirect to signin on success
      })
      .catch(() => {
        localStorage.removeItem('access_token'); // Clear access token on error as well
        window.location.href = '/auth/signin'; // Redirect to signin on error
      });
  };

  useEffect(() => {
    fetchUsers(currentPage, searchTerm); // Gọi API với currentPage và searchTerm
  }, [accessToken, currentPage]); // Không thêm searchTerm vào dependency array

  const fetchUsers = (page: number, search: string) => {
    if (!accessToken) return;

    setLoading(true);

    let config = {
      method: 'get',
      url: `${URL}admin/users-pagable?page=${page}&searchTerm=${search}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
    };

    Axios.request(config)
      .then((response) => {
        setUsers(response.data.content);
        setTotalPage(response.data.totalPages);
        setCurrentPage(response.data.number);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);

    console.log(term);
    // Xóa timeout cũ nếu có
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Đặt timeout mới
    const newTimeoutId = setTimeout(() => {
      fetchUsers(currentPage, term); // Gọi API sau 3 giây dừng gõ
    }, 1500);

    setTimeoutId(newTimeoutId); // Lưu timeout mới vào state
  };

  return (
    <>
      <Breadcrumb pageName="Users table" />

      <div className="flex flex-col gap-10">
        {loading ? ( // Show spinner while loading
          <Loader /> // Replace this with your actual spinner component
        ) : (
          <UsersTable
            data={users}
            currentPage={currentPage}
            totalPage={totalPage}
            searchTerm={searchTerm}
            onPageChange={handlePageChange}
            onSearchChange={handleSearchChange}
          />
        )}
      </div>
    </>
  );
};

export default UserTable;
