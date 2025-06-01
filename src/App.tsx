import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import PendingDeposit from './pages/PendingDeposit';
import PendingWithdraw from './pages/PendingWithdraw';
import UserTable from './pages/UserTable';
import InvestmentsTable from './pages/InvestmentsTable';
import DepositTable from './pages/DepositTable';
import WithdrawTable from './pages/WithdrawTable';
import TransferTable from './pages/TransferTable';
import SwapTable from './pages/SwapTable';
import DirectCommission from './pages/DirectCommission';
import FaSettings from "./pages/FaSettings";
import BinaryCommission from './pages/BinaryCommission';
import LeaderCommission from './pages/LeaderCommission';
import PopCommission from './pages/PopCommission';
import DailyReward from './pages/DailyReward';
import AdminInfo from './pages/AdminInfo';
import PendingDepositMCT from './pages/PendingDepositMCT';
import PendingWithdrawMCT from './pages/PendingWithdrawMCT';
import PendingWithdrawTon from './pages/PendingWithdrawTon';
import PendingWithdrawBnb from './pages/PendingWithdrawBnb';
import PendingWithdrawXrp from './pages/PendingWithdrawXrp';
import PendingWithdrawEth from './pages/PendingWithdrawEth';
import PendingWithdrawKas from './pages/PendingWithdrawKas';
import AdminChatbox from './pages/AdminChatbox';
import UserInfo from './pages/UserInfo';


function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="Mapchain admin dashboard" />
              <ECommerce />
            </>
          }
        />
        <Route
          path="/calendar"
          element={
            <>
              <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Calendar />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Profile />
            </>
          }
        />
        <Route
          path="/forms/form-elements"
          element={
            <>
              <PageTitle title="Form Elements | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <FormElements />
            </>
          }
        />
        <Route
          path="/forms/form-layout"
          element={
            <>
              <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <FormLayout />
            </>
          }
        />
        
        <Route
          path="/tables"
          element={
            <>
              <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Tables />
            </>
          }
        />
        <Route
          path="/chart"
          element={
            <>
              <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Chart />
            </>
          }
        />
        <Route
          path="/ui/alerts"
          element={
            <>
              <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Alerts />
            </>
          }
        />
        <Route
          path="/ui/buttons"
          element={
            <>
              <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Buttons />
            </>
          }
        />
        <Route
          path="/auth/signin"
          element={
            <>
              <SignIn />
            </>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <SignUp />
            </>
          }
        />
        <Route
          path="/pending-deposit"
          element={
            <>
              <PageTitle title="Pending Deposit" />
              <PendingDeposit />
            </>
          }
        />
        <Route
          path="/pending-deposit-ton"
          element={
            <>
              <PageTitle title="Pending Deposit TON" />
              <PendingDepositMCT />
            </>
          }
        />
        <Route
          path="/pending-withdraw-ton"
          element={
            <>
              <PageTitle title="Pending Withdraw TON" />
              <PendingWithdrawTon />
            </>
          }
        />
        <Route
          path="/pending-withdraw-bnb"
          element={
            <>
              <PageTitle title="Pending Withdraw BNB" />
              <PendingWithdrawBnb />
            </>
          }
        />
        <Route
          path="/pending-withdraw-eth"
          element={
            <>
              <PageTitle title="Pending Withdraw ETH" />
              <PendingWithdrawEth />
            </>
          }
        />
        <Route
          path="/chatbox"
          element={
            <>
              <PageTitle title="Chatbox" />
              <AdminChatbox />
            </>
          }
        />
        <Route
          path="/pending-withdraw-xrp"
          element={
            <>
              <PageTitle title="Pending Withdraw XRP" />
              <PendingWithdrawXrp />
            </>
          }
        />
        <Route
          path="/pending-withdraw-kas"
          element={
            <>
              <PageTitle title="Pending Withdraw Kaspa" />
              <PendingWithdrawKas />
            </>
          }
        />
        <Route
          path="/pending-withdraw-mct"
          element={
            <>
              <PageTitle title="Pending Withdraw MCT" />
              <PendingWithdrawMCT />
            </>
          }
        />
        <Route
          path="/user/:id"
          element={
            <>
              <PageTitle title="User page" />
              <Settings />
            </>
          }
        />
        <Route
          path="/user-info/:id"
          element={
            <>
              <PageTitle title="User info" />
              <UserInfo />
            </>
          }
        />
        <Route
          path="/tools"
          element={
            <>
              <PageTitle title="Admin Info" />
              <AdminInfo />
            </>
          }
        />
        <Route
          path="/pending-withdraw"
          element={
            <>
              <PageTitle title="Pending Withdraw" />
              <PendingWithdraw />
            </>
          }
        />
        <Route
          path="/users"
          element={
            <>
              <PageTitle title="List users" />
              <UserTable />
            </>
          }
        />
        <Route
          path="/investments"
          element={
            <>
              <PageTitle title="List investments" />
              <InvestmentsTable />
            </>
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <PageTitle title="2FA Settings" />
              <FaSettings />
            </>
          }
        />
        <Route
          path="/deposit"
          element={
            <>
              <PageTitle title="List deposit" />
              <DepositTable />
            </>
          }
        />
        <Route
          path="/withdraw"
          element={
            <>
              <PageTitle title="List withdraw" />
              <WithdrawTable />
            </>
          }
        />
        <Route
          path="/transfer"
          element={
            <>
              <PageTitle title="List transfer" />
              <TransferTable />
            </>
          }
        />
        <Route
          path="/swap"
          element={
            <>
              <PageTitle title="List swap" />
              <SwapTable />
            </>
          }
        />
        <Route
          path="/direct"
          element={
            <>
              <PageTitle title="Direct commission" />
              <DirectCommission />
            </>
          }
        />
        <Route
          path="/binary"
          element={
            <>
              <PageTitle title="Binary commisison" />
              <BinaryCommission />
            </>
          }
        />
        <Route
          path="/leader"
          element={
            <>
              <PageTitle title="Leader commission" />
              <LeaderCommission />
            </>
          }
        />
        <Route
          path="/pop"
          element={
            <>
              <PageTitle title="POP commission" />
              <PopCommission />
            </>
          }
        />
        <Route
          path="/daily"
          element={
            <>
              <PageTitle title="Daily reward" />
              <DailyReward />
            </>
          }
        />
      </Routes>
    </DefaultLayout>
  );
}

export default App;
