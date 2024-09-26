import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Transactions from '../components/TransactionsPage';
import NewTransactionFormModal from '../components/NewTransFormModal';
import Layout from './Layout';
import GoalsPage from '../components/GoalsPage';
import BudgetsPage from '../components/Budgets/BudgetsPage';
import LandingPage from '../components/LandingPage'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage/>,
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
        path: "budgets",
        element: <BudgetsPage />
      },
      {
        path: "*",
        element: <LoginFormPage />
      }
    ],
  },
]);