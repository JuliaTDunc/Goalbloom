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
        element: <p>Welcome to GoalBloom!
          Ready to get your finances on track? Say hello to GoalBloom, your new favorite budgeting tool, here to making money management easy and even a bit fun!
          Stay Updated
           Keep tabs on your spending, set savings goals, and see where your money goes!
          Learn as You Go
           Goalbloom has cool tips and articles to help you get smarter with your cash!
          Plan Ahead
           Select from your income, expenses, and goals, and GoalBloom will whip up budgeting plans to help you manage your money!</p>,
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