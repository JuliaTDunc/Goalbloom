import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import {fetchBudget} from '../../redux/budget';
import {fetchBudgetItemsByBudget} from '../../redux/budgetItem';
import BudgetForm from '../BudgetForm';
import { useModal } from '../../context/Modal';
//import './BudgetsPage.css'



const BudgetsPage = () => {
    const user = useSelector(state => state.session.user);
    const [budgets, setBudgets] = useState([]);
    const {setModalContent} = useModal();

    const openBudgetModal = () => {
        setModalContent(<BudgetForm />);
    }

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


return (
    <div className='budgets-page'>
        <div className='budgets-page-header'>
            <h1>Welcome, {user?.username}</h1>
            <p>Check out your budget plans below!</p>
        </div>

        <div className='new-budget-button'>
            <button className='new-budget-btn' onClick={() => openBudgetModal()}>
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
                            <td>{new Date(budget.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className='budgets-'></div>  
    </div>
)
}

export default BudgetsPage;