import React, { useState, useRef} from 'react';
import { NavLink } from 'react-router-dom';
import 'animate.css';
import HomeLinkLogo from '../../images/HomeLinkLogo.png';
import PhoneVideo from '../../images/PhoneVideo.mp4';
import Piggy from '../../images/Piggy.png';
import featureImg1 from '../../images/featureImg1.png';
import featureImg2 from '../../images/featureImg2.png';
import featureImg3 from '../../images/featureImg3.png';
import featureImg4 from '../../images/featureImg4.png';
import SignupFormPage from '../SignupFormPage';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBudgets } from '../../redux/budget';
import BudgetGraph from '../BudgetChart/BudgetChart';
import { LandingPageTransactionsGraph} from '../TransactionsModal';
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

    useEffect(() => {
        dispatch(fetchBudgets());
    }, [dispatch]);

    if(user){
        
    }
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

    const userData = useMemo(() => {
        if (user && currentBudget && budgetItems) {
            const transactionItems = budgetItems.filter(item => item.transaction);
            const totalExpenseAmount = transactionItems
                .map(item => transactions.find(transaction => transaction.id === item.item_id && transaction.expense))
                .filter(transaction => transaction !== undefined)
                .reduce((sum, transaction) => sum + transaction.amount, 0);

            return {
                remainingBalance: currentBudget.total_amount - totalExpenseAmount,
                totalIncome: currentBudget.total_amount,
            };
        }
        return null;
    }, [user, currentBudget, budgetItems, transactions]);

    useEffect(() => {
        const loadData = async () => {
            if (user) {
                await dispatch(fetchBudgets());
                setIsLoaded(true);
            }
        };
        loadData();
    }, [dispatch, user]);

    
    return user ? (
    <>
        <div className="landing-page-logged-in">
            <div className='top-section-logged-in'>
                    <div className="welcome-section-logged-in animate__animated animate__slideInLeft">
                        <h1 className="welcome-heading-logged-in">Hello, {user.username}!</h1>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vehicula dui eget nisl.</p>
                        <p>Quisque id nisi ac urna pharetra facilisis sit amet ac magna. Nulla facilisi.</p>
                    </div>
                    {closestBudget && (
                        <div className="budget-chart-section">
                            <BudgetGraph budget={closestBudget} />
                        </div>
                    )}
            </div>
                    {allTransactions && (
                        <div className='transaction-chart-section'>
                            <LandingPageTransactionsGraph/>
                        </div>
                    )}
                <h3 className='animate__animated animate__slideInLeft'>Explore Financial Resources</h3>
            <div className='bottom-section-logged-in'>
                <div className='stem-bullets'>
                    <div className="stem-container">
                        <div className="stem"></div>
                        <div className="circle circle-1"></div>
                        <div className="circle circle-2"></div>
                        <div className="circle circle-3"></div>
                        <div className="circle circle-4"></div>
                    </div>
                    <div className='landing-page-related-articles'><RelatedArticles userData={userData} /></div>
                </div>
            </div>
        </div>
    </>) : (
        <>
        <div className="landing-page-logged-out">
            <div className='top-section-logged-out'>
                <div className="welcome-section-logged-out">
                            <div className='slogan animate__animated animate__slideInLeft'>
                        <h1 className="welcome-heading-logged-out">Welcome to </h1>
                        <img src={HomeLinkLogo} className='goalbloom-word-logged-out'/>
                    </div> 
                    <p className="welcome-text">Ready to get your finances on track? Say hello to GoalBloom, your new favorite budgeting tool, here to make money management easy and even a bit fun!</p>
                </div>
                <div className="welcome-image-section-logged-out">
                            <img src={Piggy} alt='Piggy Bank' className="top-image"/>
                </div>
            </div>
            <div className='sign-up-button-landing-page'>
                <NavLink to='/signup' className='signup-button'> Sign Up</NavLink>
            </div>
            <div className='middle-section'>
                <div><h2 className='phone-image-head'>Where goals meet growth</h2></div>
                <div className='image-phone-goalbloom'>
                            <video src={PhoneVideo} className="phone-image" autoPlay muted playsInline />
                </div>
            </div>
            <div className="features-section">
                    <div>
                            <h2 className="feature-text">Welcome to smarter spending. Start your budget journey today.</h2>
                    </div>
                    <div className="feature-grid">
                        <img src={featureImg1} alt="Feature 1" className="feature-image" />
                        <img src={featureImg2} alt="Feature 2" className="feature-image" />
                        <img src={featureImg3} alt="Feature 3" className="feature-image" />
                        <img src={featureImg4} alt="Feature 4" className="feature-image" />
                    </div>
                </div>
                <div className='bottom-section'>
                    <footer>
                        {/*<h2>Connect</h2>*/}
                    </footer>
                </div>
        </div>
        </>
    )
}

export default LandingPage;