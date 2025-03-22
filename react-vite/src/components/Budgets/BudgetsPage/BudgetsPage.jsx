import {useEffect, useState, useMemo} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBudgets} from '../../../redux/budget';
import { fetchBudgetItemsByBudget } from '../../../redux/budgetItem';
import { fetchTransactions } from '../../../redux/transaction';
import { fetchGoals } from '../../../redux/goals';
import { useModal } from '../../../context/Modal';
import BudgetGraph from '../BudgetChart/BudgetChart';
import BudgetForm from '../BudgetForm';
//import BudgetSummary from '../BudgetSummary';
import SavedBudgets from './SavedBudgets/SavedBudgets';
import LoginFormModal from '../../Auth/LoginFormModal';
import RelatedArticles from '../../Education/ResourceLinks/RelatedArticles';
import './BudgetsPage.css';



const BudgetsPage = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const allBudgets = useSelector(state => state.budgets.allBudgets);
    const currentBudget = useSelector(state => state.budgets.currentBudget);
    const budgetItems = useSelector(state => state.budgetItems.budgetItems);
    const allTransactions = useSelector(state => state.transactions.allTransactions);
    const allGoals = useSelector(state => state.goals.allGoals);
    const [loadedSavedDetail, setLoadedSavedDetail] = useState(false);

    const budgets = useMemo(() => Object.values(allBudgets), [allBudgets]);
    const transactions = useMemo(() => Object.values(allTransactions), [allTransactions]);
    const goals = useMemo(() => Object.values(allGoals), [allGoals]);
    
    const { setModalContent } = useModal();
    const [currBudget, setCurrBudget] = useState(null);
    const [currBudgetItems, setCurrBudgetItems] = useState([]);
    let userData = {};
    let summaryData;

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                await Promise.all([
                    dispatch(fetchBudgets()),
                    dispatch(fetchTransactions()),
                    dispatch(fetchGoals()),
                ]);
                setLoadedSavedDetail(true);
            }
        };
        fetchData();
    }, [user, dispatch]);

    // set currbudget INSTEAD of set currBUDGETITEMS
    useEffect(() => {
        if (currentBudget) {
            dispatch(fetchBudgetItemsByBudget(currentBudget.id)).then(() => {
                setCurrBudgetItems(currentBudget.id);
            });
        }
    }, [currentBudget, dispatch]);

    useEffect(() => {
        if (budgets.length > 0 && !currentBudget) {
            const today = new Date();
            const closestBudget = budgets.reduce((closest, budget) => {
                const budgetDate = new Date(budget.start_date);
                return Math.abs(budgetDate - today) < Math.abs(new Date(closest.start_date) - today)
                    ? budget
                    : closest;
            }, budgets[0]);
            if (!currBudget || currBudget.id !== closestBudget.id) {
                setCurrBudget(closestBudget);
            }
        }
    }, [budgets, currentBudget, currBudget]);

    // needs to include GOALS

    useEffect(() => {
        if (currentBudget && budgetItems) {
            const filteredItems = budgetItems.filter(item => item.budget_id === currentBudget.id);
            const transactionItems = filteredItems.filter(item => item.transaction);

            const totalExpenseAmount = transactionItems
                .map(item => transactions.find(transaction => transaction.id === item.item_id && transaction.expense))
                .filter(transaction => transaction !== undefined)
                .reduce((sum, transaction) => sum + transaction.amount, 0);
          
                if (currentBudget){
                userData.remainingBalance = (currentBudget.total_amount - totalExpenseAmount),
                userData.totalIncome = currentBudget.total_amount
                };

            console.log('User data: ', userData);

            summaryData = {
                ...currentBudget,
                budgetItems: filteredItems
            };
        };
    },[currentBudget])

    const updateCurrentBudget = (budget) => {
        setCurrBudget(budget);
    };
    const openNewBudgetModal = () => {
        setModalContent(<BudgetForm budget={null}/>)
    }

    
    return user? (
        <div className='budgets-page'>
            <div className='top-budgets-page-section'>
                <section className='budgets-description animate__animated animate__slideInLeft'>
                    <h2 className='feature-page-head'>Budgets</h2>
                    <div className='feature-head-divider'></div>
                    <p className='feature-page-subhead'>Welcome to your Budgets Page</p>
                    {!allBudgets ? (<p className='feature-page-subhead'>To get started, select dates for your budget and simply choose the Transaction and Goal items you want to apply to your budget. </p>) :
                        <p className='feature-page-subhead'>Check out your budgets down below</p>}
                </section>

                <div className='new-budget-button'>
                    <button className='feature-page-create-button' onClick={() => openNewBudgetModal()}>
                        New Budget
                    </button>
                </div>

                <div className='budgets-content'>
                    <div className='current-budget-section'>
                        {currBudget ? (
                            <div className='budget-chart'>
                                <BudgetGraph budget={currBudget} />
                            </div>
                        ) : (
                            <div className='budget-chart'>
                                <p>Select a Budget</p>
                            </div>
                        )}
                    </div>
                    {/*<div className='current-summary-section'>
                        {summaryData && (
                            <div>
                                <BudgetSummary budgetDetails={summaryData}/>
                            </div>
                        )}
                    </div>*/}
                    {loadedSavedDetail ? (
                        <div className='saved-budgets'>
                            <h2>Saved Budgets</h2>
                            <div className='table-div'>
                                <SavedBudgets
                                    budgets={budgets}
                                    transactions={transactions}
                                    goals={goals}
                                    updateCurrentBudget={updateCurrentBudget}
                                />
                            </div>
                        </div>) : (<p>Loading...</p>)
                    }
                </div>
            </div>
            <div className='bottom-budgets-page-section'>
                {/*<div className='helpful-resources'><p className='box-placeholder'>Helpful Resources</p></div>*/}
                {userData && <div className='related-articles-budgets-page'><RelatedArticles userData={userData} /></div>}
            </div>
            </div>
    ) : (setModalContent(<LoginFormModal/>))
};

export default BudgetsPage;
