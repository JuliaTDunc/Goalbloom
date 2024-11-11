import React , {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {fetchBudget, fetchDeleteBudget, fetchBudgets} from '../../redux/budget';
import {fetchBudgetItemsByBudget} from '../../redux/budgetItem';
import { useModal } from '../../context/Modal';
import BudgetGraph from '../BudgetChart/BudgetChart';
import BudgetForm from '../BudgetForm';
import { FaRegTrashAlt } from 'react-icons/fa';
import LoginFormModal from '../LoginFormModal';
import './BudgetsPage.css';



const BudgetsPage = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const allBudgets = useSelector(state => state.budgets.allBudgets);
    const currentBudget = useSelector(state => state.budgets.currentBudget);
    const budgetItems = useSelector(state => state.budgetItems.budgetItems);
    const [budgets, setBudgets] = useState([]);
    const [currBudget, setCurrBudget] = useState(null);
    const [currBudgetItems, setCurrBudgetItems] = useState([]);
    const { setModalContent } = useModal();

    const openNewBudgetModal = () => {
        setModalContent(<BudgetForm budget={null}/>);
    };
    const updateChartBudget = (budget) => {
        dispatch(fetchBudget(budget.id))
        .then(()=>{
            setCurrBudget(budget);
        })
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        if (isNaN(date)) return 'Invalid Date';
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };
    useEffect(() => {
        if (user) {
            dispatch(fetchBudgets());
        }
    }, [user, dispatch]);

    useEffect(() => {
        if (allBudgets) {
            const sortedBudgets = Object.values(allBudgets).sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
            setBudgets(sortedBudgets);
        }
    }, [allBudgets]);
    
    useEffect(() => {
        if (allBudgets && !currentBudget) {
            const today = new Date();
            const closestBudget = budgets.reduce((closest, budget) => {
            const budgetDate = new Date(budget.start_date);
            return Math.abs(budgetDate - today) < Math.abs(new Date(closest.start_date) - today)
            ? budget
            : closest;
            },[budgets[0]])

            const deconClosest = closestBudget[0]
            setCurrBudget(deconClosest)
            console.log(deconClosest)
        }
    },[allBudgets, budgets, dispatch]);

    useEffect(() => {
        if(currentBudget){
            dispatch(fetchBudgetItemsByBudget(currentBudget.id))
            .then(() => {
                setCurrBudgetItems(currentBudget.id)
            })
        }
    },[currentBudget,dispatch])

    const handleDelete = (budgetId) => {
        dispatch(fetchDeleteBudget(budgetId))
            .then(() => {
                dispatch(fetchBudgets());
            })
            .catch((error) => {
                console.error('Failed to delete goal:', error);
            });
    };

    return user? (
        <div className='budgets-page'>
            <div className='budgets-page-header'>
                <h1>Welcome, {user?.username}</h1>
                <p>Check out your budget plans below!</p>
            </div>

            <div className='new-budget-button'>
                <button className='new-budget-btn' onClick={() => openNewBudgetModal()}>
                    Create a new Budget
                </button>
            </div>

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

            <div className='saved-budgets'>
                <h2>Saved Budgets</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Budget Name</th>
                            <th>Created Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {budgets.map((budget) => (
                            <tr key={budget.id}>
                                <td><button onClick={() => updateChartBudget(budget)}>{budget.name}</button></td>
                                <td>{formatDate(budget.start_date)}</td>
                                <td>
                                    <button className='delete-btn-budget' onClick={() => handleDelete(budget.id)}><FaRegTrashAlt/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='related-articles'><p className='box-placeholder'>Related Articles</p></div>
        </div>
    ) : (setModalContent(<LoginFormModal/>))
}

export default BudgetsPage;
