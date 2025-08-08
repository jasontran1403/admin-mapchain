import { useState, useEffect } from 'react';
import Axios from 'axios';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import UsersTable from '../components/Tables/UserTable';
import { URL } from '../types/constant';
import Loader from '../common/Loader';
import AdminProductTable from '../components/Tables/AdminProductTable';

const ProductTable = () => {
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


  useEffect(() => {
    fetchUsers(currentPage, searchTerm); // Gọi API với currentPage và searchTerm
  }, [accessToken, currentPage]); // Không thêm searchTerm vào dependency array

  const fetchUsers = (page: number, search: string) => {
    if (!accessToken) return;

    setLoading(true);
    console.log(search.length);
    let config = {
      method: 'get',
      url: `${URL}admin/products?page=${page}&searchTerm=${search}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'ngrok-skip-browser-warning': '69420',
      },
    };

    Axios.request(config)
      .then((response) => {
        setUsers(response.data.content);
        setTotalPage(response.data.totalPages);
        // Không cần setCurrentPage ở đây nữa
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);

    // Xóa timeout cũ nếu có
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Đặt timeout mới
    const newTimeoutId = setTimeout(() => {
      // Reset currentPage về 0 khi có từ khóa tìm kiếm
      if (term.trim().length > 0) {
        setCurrentPage(0); // Reset về trang 0
      }
      fetchUsers(0, term); // Gọi API với currentPage là 0
    }, 1500);

    setTimeoutId(newTimeoutId); // Lưu timeout mới vào state
  };


  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <Breadcrumb pageName="Users table" />

      <div className="flex flex-col gap-10">
        {loading ? ( // Show spinner while loading
          <Loader /> // Replace this with your actual spinner component
        ) : (
          <AdminProductTable
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

export default ProductTable;
