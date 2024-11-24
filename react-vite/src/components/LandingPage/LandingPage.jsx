import React, { useState } from 'react';
import Fleur from '../../images/fleur.png'
import { FaCogs } from 'react-icons/fa';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBudgets } from '../../redux/budget';
import BudgetGraph from '../BudgetChart/BudgetChart';
import RelatedArticles from '../ResourceLinks/RelatedArticles';
import './LandingPage.css'

function LandingPage() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const budgetsObj = useSelector(state => state.budgets.allBudgets);
    const budgets = Object.values(budgetsObj);
    const currentBudget = useSelector(state => state.budgets.currentBudget);
    const budgetItems = useSelector(state => state.budgetItems.budgetItems);
    const allTransactions = useSelector(state => state.transactions.allTransactions);
    const transactions = Object.values(allTransactions);
    const [isLoaded, setIsLoaded] = useState(false);
    let userData;

    const openFeatures = (() => {
        alert('-AI Budget Summaries -Budget Editing');
    });

    useEffect(() => {
            dispatch(fetchBudgets());
    }, [dispatch]);

    const closestBudget = useMemo(() => {
        if (!budgets || budgets.length === 0) return null;

        const today = new Date();
        return budgets.reduce((closest, budget) => {
            const budgetDate = new Date(budget.start_date);
            return Math.abs(budgetDate - today) < Math.abs(new Date(closest.start_date) - today)
                ? budget
                : closest;
        });
    }, [budgets]);

        if (user && currentBudget && budgetItems) {
            const transactionItems = budgetItems.filter(item => item.transaction);
            const totalExpenseAmount = transactionItems
                .map(item => transactions.find(transaction => transaction.id === item.item_id && transaction.expense))
                .filter(transaction => transaction !== undefined)
                .reduce((sum, transaction) => sum + transaction.amount, 0);
            userData = {
                remainingBalance: (currentBudget.total_amount - totalExpenseAmount),
                totalIncome: currentBudget.total_amount
            }
        };

    return user ? (
    <>
        <div className="landing-page">
            <div className='top-section'>
                    <div className="welcome-section">
                        <img src={Fleur} alt="Welcome Fleur" className="fleur-image" />
                        <h1 className="welcome-heading">Welcome {user.username}</h1>
                        <h4 className="features-title">More Features Coming Soon...<FaCogs className='clogs' onClick={openFeatures} /></h4>
                    </div>
                    {closestBudget && (
                        <div className="budget-chart-section">
                            <BudgetGraph budget={closestBudget} />
                        </div>
                    )}
            </div>
            <div className='bottom-section'>
                    <div className='landing-page-related-articles'><RelatedArticles userData={userData} /></div>
            </div>
        </div>
    </>) : (
        <>
            <div className="landing-page">
                <div className='top-section'>
                        <div className="welcome-section">
                            <img src={Fleur} alt="Welcome Fleur" className="fleur-image" />
                            <h1 className="welcome-heading">Welcome</h1>
                            <p className="welcome-text">
                                Ready to get your finances on track? Say hello to GoalBloom, your new favorite budgeting tool, here to make money management easy and even a bit fun!
                            </p>
                        </div>
                        <div className="features-section">
                            <div className="feature-grid">
                                <div className="feature-item">
                                    <h2>Stay Updated</h2>
                                    <p>Keep tabs on your spending, set savings goals, and see where your money goes!</p>
                                </div>
                                <div className="feature-item">
                                    <h2>Plan Ahead</h2>
                                    <p>Goalbloom has cool tips and articles to help you get smarter with your cash!</p>
                                </div>
                                <div className="feature-item">
                                    <h2>Learn As You Go</h2>
                                    <p>Select from your income, expenses, and goals, and GoalBloom will whip up budgeting plans to help you manage your money!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>  
        </>
    )
}

export default LandingPage;