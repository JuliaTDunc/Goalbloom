import {useState, useEffect} from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { useModal } from "../../context/Modal";
import {fetchCreateBudget, fetchEditBudget,fetchBudget} from '../../redux/budget';
import { fetchTransactions } from '../../redux/transaction';
import { fetchGoals } from '../../redux/goals';
import './BudgetForm.css';
import { fetchBudgetItemsByBudget } from '../../redux/budgetItem';

const BudgetForm = ({budget}) => {
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { closeModal } = useModal();

    const [incomeItems, setIncomeItems] = useState([{}]);
    const [expenseItems, setExpenseItems] = useState([{}]);
    const [goalItems, setGoalItems] = useState([{}]);
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
        if(startDate && endDate) {
            const sortIncomeItems = transactions.filter(
                item => !item,expense && new Date(item.date) >= new Date(startDate) && newDate(item.date) <= newDate(endDate)
            );
            const sortExpenseItems = transactions.filter(
                item => item.expense && new Date(item.date) >= new Date(startDate) && newDate(item.date) <= newDate(endDate)
            );
            const sortGoals = goals.filter(
                goal => newDate(goal.end_date) >= new Date(startDate) && new Date(goal.end_date) <= new Date(endDate)
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

        const totalIncome = incomeItems.reduce((sum, item) => sum + Number(item.amunt), 0);
        const totalExpenses = expenseItems.reduce((sum, item) => sum + Number(item.amount), 0);
        const remainingBalance = totalIncome - totalExpenses;

        const handleSubmit = async (e) => {
            e.preventDefault();

            const items = [
                ...incomeItems.map(item => ({transaction:true, item_id: item.id})),
                ...expenseItems.map(item => ({transaction:true, item_id: item.id})),
                ...goalItems.map(item => ({transaction:false, item_id: item.id}))
            ];

            const budgetData = {
                name,
                total_amount: totalIncome,
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
                        type='text'
                        value={name}
                        onChange = {(e) => setName(e.target.value)}
                        required
                        />
                    </div>
                    <div>
                        <label>Start Date:</label>
                        <input
                        type='date'
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                        />
                    </div>
                    <div>
                        <label>End Date:</label>
                        <input
                        type='date'
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                        />
                    </div>
                    <section>
                        <h2>Income Sources</h2>
                        {incomeItems.map((item) => (
                            <div key={item.id} className='budget-item'>
                                <input
                                type='text'
                                placeholder='Name'
                                value={item.name}
                                onChange={(e) => handleChange('income', item.id, 'amount', e.target.value)}
                                />
                                <input
                                    type='number'
                                    placeholder='Amount'
                                    value={item.amount}
                                    onChange={(e) => handleChange('income', item.id, 'amount', e.target.value)}
                                />
                                <button type='button' onClick={() =>removeItem('income', item.id)}>Remove</button>
                            </div>
                        ))}
                        <button type='button' onClick={() => addItem('income')}>Add Income</button>
                    </section>

                    <section>
                        <h2>Expenses</h2>
                        {expenseItems.map((item) => (
                            <div key={item.id} className='budget-item'>
                                <input
                                type='text'
                                placeholder='Name'
                                value = {item.name}
                                onChange = {(e) => handleChange('expense', item.id, 'amount', e.target.value)}
                                />
                                <button type='button' onClick={() => removeItem('expense',item.id)}>Remove</button>
                            </div>
                        ))}
                        <button type='button' onClick={() => addItem('expense')}>Add Expense</button>
                    </section>
                    <section>
                        <h2>Goals</h2>
                        {goalItems.map((item) => (
                            <div key={item.id} className='budget-item'>
                                <input
                                type='text'
                                placeholder='Name'
                                value={item.amount}
                                onChange={(e) => handleChange('goal', item.id, 'amount', e.target.value)}
                                />
                                <button type='button' onClick={() => removeItem('goal', item.id)}>Remove</button>
                            </div>
                        ))}
                    </section>

                    <section className='remaining-balance'>
                        <h3>Remaining Balance  {remainingBalance}</h3>
                    </section>
                    <button type='submit'>Save Budget</button>
                </form>
            </div>
        )
    };
};

export default BudgetForm;