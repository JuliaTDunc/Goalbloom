import React, {useState, useEffect, useRef} from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { useModal } from "../../context/Modal";
import {fetchCreateBudget, fetchEditBudget,fetchBudget} from '../../redux/budget';
import { fetchTransactions } from '../../redux/transaction';
import { fetchGoals } from '../../redux/goals';
import './BudgetForm.css';
import { fetchBudgetItemsByBudget } from '../../redux/budgetItem';

const BudgetForm = ({budget}) => {
    const inputRefs = useRef({
        name: null,
        startDate: null,
        endDate: null,
        incomeItems: [],
        expenseItems: [],
        goalItems: []
    });
    const dispatch = useDispatch();
    const [name, setName] = useState(budget?.name || '');
    const [startDate, setStartDate] = useState(budget?.start_date || '');
    const [endDate, setEndDate] = useState(budget?.end_date || '');
    const { closeModal } = useModal();

    const [incomeItems, setIncomeItems] = useState(budget?.incomeItems || [{}]);
    const [expenseItems, setExpenseItems] = useState(budget?.expenseItems || [{}]);
    const [goalItems, setGoalItems] = useState(budget?.goalItems || [{}]);
    const [remainingBalance, setRemainingBalance] = useState(0); 


    const allTransactions = useSelector(state => state.transactions.allTransactions);
    const allGoals = useSelector(state => state.goals.allGoals);
    const transactions = Object.values(allTransactions)
    const goals = Object.values(allGoals)

    useEffect(() => {
        dispatch(fetchTransactions());
        dispatch(fetchGoals());
    },[dispatch]);

    useEffect(() => {
        if (budget) {
            setName(budget.name);
            setStartDate(budget.start_date);
            setEndDate(budget.end_date);
            setIncomeItems(budget.incomeItems || [{}]);
            setExpenseItems(budget.expenseItems || [{}]);
            setGoalItems(budget.goalItems || [{}]);

            inputRefs.current.name.value = budget.name;
            inputRefs.current.startDate.value = budget.start_date;
            inputRefs.current.endDate.value = budget.end_date;

            budget.incomeItems?.forEach((item, index) => {
                inputRefs.current.incomeItems[index].name.value = item.name || '';
                inputRefs.current.incomeItems[index].amount.value = item.amount || 0;
            });

            budget.expenseItems?.forEach((item, index) => {
                inputRefs.current.expenseItems[index].name.value = item.name || '';
                inputRefs.current.expenseItems[index].amount.value = item.amount || 0;
            });

            budget.goalItems?.forEach((item, index) => {
                inputRefs.current.goalItems[index].name.value = item.name || '';
                inputRefs.current.goalItems[index].amount.value = item.amount || 0;
            });
        }
    }, [budget]);



    useEffect(() => {
        if(startDate && endDate) {
            const sortIncomeItems = transactions.filter(
                item => !item,expense && new Date(item.date) >= new Date(startDate) && new Date(item.date) <= new Date(endDate)
            );
            const sortExpenseItems = transactions.filter(
                item => item.expense && new Date(item.date) >= new Date(startDate) && new Date(item.date) <= new Date(endDate)
            );
            const sortGoals = goals.filter(
                goal => new Date(goal.end_date) >= new Date(startDate) && new Date(goal.end_date) <= new Date(endDate)
            );

            setIncomeItems(sortIncomeItems);
            setExpenseItems(sortExpenseItems);
            setGoalItems(sortGoals);
        } 
    }, [startDate, endDate, transactions, goals])

    useEffect(() => {
        const totalIncome = incomeItems.reduce((sum, item) => sum + Number(item.amount), 0);
        const totalExpenses = expenseItems.reduce((sum, item) => sum + Number(item.amount), 0);
        const totalGoals = goalItems.reduce((sum, goal) => sum + (Number(goal.amount) - Number(goal.saved_amount)),0)
        setRemainingBalance(totalIncome - (totalExpenses + totalGoals));
    }, [incomeItems, expenseItems, goalItems]);


    const addItem = (type) => {
        const newItem = {id: Date.now(), amount:0};
        if(type==='income'){
            setIncomeItems([...incomeItems, newItem]);
        } else if(type === 'expense') {
            setExpenseItems([...expenseItems, newItem]);
        } else if (type === 'goal'){
            setGoalItems([...goalItems, newItem])
        }
    }

    const removeItem = (type, id) => {
        if (type==='income'){
            setIncomeItems(incomeItems.filter((item) => item.id !== id))
        } else if (type==='expense'){
            setExpenseItems(expenseItems.filter((item) => item.id !== id))
        } else if (type==='goal'){
            setGoalItems(goalItems.filter((item) => item.id !== id))
        }

        const handleChange = (type, id, field, value) => {
            if(type === 'income'){
                setIncomeItems(incomeItems.map(item => item.id === id ? {...item, [field]: value}: item))
            } else if (type === 'expense') {
                setExpenseItems(expenseItems.map(item => item.id === id ? {...item, [field]: value}: item))
            } else if (type === 'goal'){
                setGoalItems(goalItems.map(item => item.id === id ? {...item, [field]:value}: item))
            }
        }

        const handleSubmit = async (e) => {
            e.preventDefault();

            const items = [
                ...incomeItems.map(item => ({transaction:true, item_id: item.id})),
                ...expenseItems.map(item => ({transaction:true, item_id: item.id})),
                ...goalItems.map(item => ({transaction:false, item_id: item.id}))
            ];

            const budgetData = {
                name,
                total_amount: incomeItems.reduce((sum, item) => sum + Number(item.amount), 0),
                start_date: startDate,
                end_date: endDate,
                items
            };
            try{
                if(budget){
                    await dispatch(fetchEditBudget(budgetData, budget));
                }else {
                    await dispatch(fetchCreateBudget(budgetData));
                }
                closeModal();
                dispatch(fetchBudget());
            }catch(error){
                return error
            }
        }
        return (
            <div className='new-budget-page'>
                <h1>Budget Plan</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Budget Name:</label>
                        <input
                            ref={(el) => inputRefs.current.name = el}
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Start Date:</label>
                        <input
                            ref={(el) => inputRefs.current.startDate = el}
                            type='date'
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>End Date:</label>
                        <input
                            ref={(el) => inputRefs.current.endDate = el}
                            type='date'
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </div>
                    <section>
                        <h2>Income Sources</h2>
                        {incomeItems.map((item, index) => (
                            <div key={item.id} className='budget-item'>
                                <input
                                    ref={(el) => inputRefs.current.incomeItems[index] = { ...inputRefs.current.incomeItems[index], name: el }}
                                    type='text'
                                    placeholder='Name'
                                    value={item.name}
                                    onChange={(e) => handleChange('income', item.id, 'name', e.target.value)}
                                />
                                <input
                                    ref={(el) => inputRefs.current.incomeItems[index] = { ...inputRefs.current.incomeItems[index], amount: el }}
                                    type='number'
                                    placeholder='Amount'
                                    value={item.amount}
                                    onChange={(e) => handleChange('income', item.id, 'amount', e.target.value)}
                                />
                                <button type='button' onClick={() => removeItem('income', item.id)}>Remove</button>
                            </div>
                        ))}
                        <button type='button' onClick={() => addItem('income')}>Add Income</button>
                    </section>

                    <section>
                        <h2>Expenses</h2>
                        {expenseItems.map((item, index) => (
                            <div key={item.id} className='budget-item'>
                                <input
                                    ref={(el) => inputRefs.current.expenseItems[index] = { ...inputRefs.current.expenseItems[index], name: el }}
                                    type='text'
                                    placeholder='Name'
                                    value={item.name}
                                    onChange={(e) => handleChange('expense', item.id, 'name', e.target.value)}
                                />
                                <input
                                    ref={(el) => inputRefs.current.expenseItems[index] = { ...inputRefs.current.expenseItems[index], amount: el }}
                                    type='number'
                                    placeholder='Amount'
                                    value={item.amount}
                                    onChange={(e) => handleChange('expense', item.id, 'amount', e.target.value)}
                                />
                                <button type='button' onClick={() => removeItem('expense', item.id)}>Remove</button>
                            </div>
                        ))}
                        <button type='button' onClick={() => addItem('expense')}>Add Expense</button>
                    </section>
                    <section>
                        <h2>Goals</h2>
                        {goalItems.map((item, index) => (
                            <div key={item.id} className='budget-item'>
                                <input
                                    ref={(el) => inputRefs.current.goalItems[index] = { ...inputRefs.current.goalItems[index], name: el }}
                                    type='text'
                                    placeholder='Name'
                                    value={item.name}
                                    onChange={(e) => handleChange('goal', item.id, 'name', e.target.value)}
                                />
                                <input
                                    ref={(el) => inputRefs.current.goalItems[index] = { ...inputRefs.current.goalItems[index], amount: el }}
                                    type='number'
                                    placeholder='Amount'
                                    value={item.amount}
                                    onChange={(e) => handleChange('goal', item.id, 'amount', e.target.value)}
                                />
                                <button type='button' onClick={() => removeItem('goal', item.id)}>Remove</button>
                            </div>
                        ))}
                        <button type='button' onClick={() => addItem('goal')}>Add Goal</button>
                    </section>

                    <section className='remaining-balance'>
                        <h3>Remaining Balance  {remainingBalance}</h3>
                    </section>

                    <button type='submit'>{budget ? 'Edit' : 'Create'} Budget</button>
                </form>
            </div>
        )
    };
};

export default BudgetForm;

/*
Goals has No amount.. make adjustments -- Goal total amount - saved amount. 
*/