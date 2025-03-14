import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Transactions from '../components/TransactionsPage';
import NewTransactionFormModal from '../components/NewTransFormModal';
import ArticlesPage from '../components/ArticlesPage';
import BookmarksPage from '../components/BookmarksPage';
import Layout from './Layout';
import GoalsPage from '../components/GoalsPage';
import BudgetsPage from '../components/BudgetsPage';
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