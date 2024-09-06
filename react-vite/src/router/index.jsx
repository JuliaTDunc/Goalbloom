import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Transactions from '../components/TransactionsPage';
import NewTransactionFormModal from '../components/NewTransFormModal';
import Layout from './Layout';
import GoalsPage from '../components/GoalsPage';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <h1>Welcome!</h1>,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "transactions",
        element: <Transactions />,
      },
      {
        path: "new-transaction",
        element: <NewTransactionFormModal />
      },
      {
        path: "goals",
        element: <GoalsPage/>
      },
      {
        path: "*",
        element: <LoginFormPage />
      }
    ],
  },
]);