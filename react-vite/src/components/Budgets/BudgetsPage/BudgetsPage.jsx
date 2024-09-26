import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import {fetchBudget} from '../../../redux/budget';
import {fetchBudgetItemsByBudget} from '../../../redux/budgetItem';
//import {BudgetFormModal} from 
//import { useModal } from '../../context/Modal';
//import './BudgetsPage.css'



const BudgetsPage = ({budgetId}) => {
    const user = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const budget = useSelector(state => state.budgets.currentBudget);

    const [editing, setEditing] = useState(false);

    useEffect(() => {
        dispatch(fetchBudget(budgetId));
        dispatch(fetchBudgetItemsByBudget(budgetId));
    }, [dispatch, budgetId])

    const handleEditToggle = () => {
        setEditing(!editing);
    };


return user && (
    <div className='budget-page'>
        {budget && (
            <>
            <h2>{budget.name} (Budget Overview)</h2>
            <div className='budget-summary'>
                <p> Start Date: {budget.start_date}</p>
                <p>End Date: {budget.end_date}</p>
                <p>Total Income: ${budget.total_income}</p>
                <p>Total Expense: ${budget.total_expenses}</p>
                <p>Remaining: ${budget.remaining}</p>
                <button onClick={handleEditToggle}>{editing ? 'View' : 'Edit'}</button>
            </div>
            {editing ? (
                <div className='budget-edit-form'>
                    {/* FORM COMPONENT*/}
                </div>
            ): (
                <>
                <div className='budget-item-list'>
                    <h3>Budget Items</h3>
                    {budgetItemsReducer.map(item => (
                        <div key={item.id}>
                            <p>Item ID: {item/item_id}</p>
                            <p>Transaction Type: {item.transaction? 'Transaction' : 'Other'}</p>
                        </div>
                    ))}
                </div>
                </>
            )}
            </>
        )}
    </div>
);
};

export default BudgetsPage;