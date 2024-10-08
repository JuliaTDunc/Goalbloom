import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import {fetchBudget, fetchDeleteBudget, fetchBudgets} from '../../redux/budget';
//import {fetchBudgetItemsByBudget} from '../../redux/budgetItem';
import BudgetForm from '../BudgetForm';
import { useModal } from '../../context/Modal';
//import {setSelectedBudget} from '../BudgetsPage/BudgetGraph';
//import './BudgetsPage.css'



const BudgetsPage = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const allBudgets = useSelector(state => state.budgets.allBudgets)
    const [budgets, setBudgets] = useState([]);
    const {setModalContent} = useModal();

    const openNewBudgetModal = () => {
        setModalContent(<BudgetForm budget={null}/>);
    }

    const openEditBudgetModal = (budget) => {
        setModalContent(<BudgetForm budget={budget}/>)
    }

    /*const updateChartBudget = (budget) => {
        setSelectedBudget(budget);
    };*/

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
        if(user){
            fetch(`/api/budgets`)
                .then((res) => res.json())
                .then((data) => {
                    const sortBudgets = data.sort((a,b) => new Date(b.start_date) - new Date(a.start_date))
                    setBudgets(sortBudgets);
                })
                .catch((err) => console.error("Failed to retch recent budget", err))
        }
    }, [user])

    const recentBudget = budgets.length > 0 ? budgets[0] : null;

    if (!recentBudget){
        return <div>rendering budgets...</div>
    }

    const handleDelete = (budgetId) => {
        dispatch(fetchDeleteBudget(budgetId))
            .then(() => {
                dispatch(fetchBudgets());
            })
            .catch((error) => {
                console.error('Failed to delete goal:', error);
            });
    };

return (
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

        <div className='recent-budget-section'>
            <h2>Recent Budget</h2>
            {recentBudget? (
                <div className='budget-chart'>
                    <p>{recentBudget.name}</p>
                </div>
            ): (
                <p>Create a new Budget to get started!</p>
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
                            <td>{budget.name}</td>
                            <td>{formatDate(budget.start_date)}</td>
                            <td>
                                <button className='edit-btn' onClick={() => openEditBudgetModal(budget)}>
                                    Edit
                                </button>
                                <button className='delete-btn'onClick={() => handleDelete(budget.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className='related-articles'><p className='box-placeholder'>Related Articles</p></div> 
    </div>
)
}

export default BudgetsPage;