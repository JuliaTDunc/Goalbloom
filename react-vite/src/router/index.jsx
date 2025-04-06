import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/Auth/LoginFormPage';
import SignupFormPage from '../components/Auth/SignupFormPage';
import Transactions from '../components/Transactions/TransactionsPage';
import NewTransactionFormModal from '../components/Transactions/NewTransFormModal';
import ArticlesPage from '../components/Education/ArticlesPage';
import BookmarksPage from '../components/Education/BookmarksPage';
import Layout from './Layout';
import GoalsPage from '../components/Goals/GoalsPage';
import BudgetsPage from '../components/Budgets/BudgetsPage';
import LandingPage from '../components/Landing/LandingPage'

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
        path: "articles",
        element: <ArticlesPage />
      },
      {
        path: "bookmarks",
        element: <BookmarksPage/>
      },
      {
        path: "*",
        element: <LoginFormPage />
      }
    ],
  },
]);