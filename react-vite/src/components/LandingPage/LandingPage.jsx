import React, { useState } from 'react';
import Fleur from '../../images/fleur.png';
import featureImg1 from '../../images/featureImg1.png';
import featureImg2 from '../../images/featureImg2.png';
import Goldblum2 from '../../images/Goldblum2.png';
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
                        <h1 className="welcome-heading">Hello, {user.username}!</h1>
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
        <div className="landing-page-logged-out">
            <div className='top-section-logged-out'>
                <div className="welcome-section-logged-out">
                    <div className='landing-page-fleur-div'>
                        <img src={Fleur} alt="Welcome Fleur" className="fleur-image" />
                    </div>
                    <div className='slogan'>
                        <h1 className="welcome-heading-logged-out">Welcome</h1>
                        <p className="welcome-text">Ready to get your finances on track? Say hello to GoalBloom, your new favorite budgeting tool, here to make money management easy and even a bit fun!</p>
                    </div> 
                </div>
                <div className="welcome-image-section-logged-out">
                    <img src={Goldblum2} alt="Image" className="top-image" />
                </div>
            </div>
            <div className='sign-up-button-landing-page'>
                <button className='signup-button'>Sign Up</button>
            </div>
            <div className='middle-section'>
                <div><h2 className='phone-image-head'>Placeholder #2</h2></div>
                <div className='image-phone-goalbloom'>
                    <img src={Goldblum2} alt='phone-image' className='phone-image'></img>
                </div>
                        <h5>Stay Updated</h5>
                        <p>Keep tabs on your spending, set savings goals, and see where your money goes!</p>
                   
                        <h5>Plan Ahead</h5>
                        <p>Goalbloom has cool tips and articles to help you get smarter with your cash!</p>
                   
                        <h5>Learn As You Go</h5>
                        <p>Select from your income, expenses, and goals, and GoalBloom will whip up budgeting plans to help you manage your money!</p>
            </div>
            <div className="features-section">
                    <div>
                        <p className="feature-text">Placeholder #3 Features</p>
                    </div>
                    <div className="feature-grid">
                        <img src={featureImg1} alt="Feature 1" className="feature-image" />
                            <img src={featureImg2} alt="Feature 2" className="feature-image" />
                            <img src={Goldblum2} alt="Feature 3" className="feature-image" />
                        <img src={Goldblum2} alt="Feature 4" className="feature-image" />
                    </div>
                </div>
                <div className='bottom-section'>
                    <footer>
                        <h2>Connect</h2>
                    </footer>
                </div>
        </div>
        </>
    )
}

export default LandingPage;