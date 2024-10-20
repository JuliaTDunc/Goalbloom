import React, {useState, useEffect, useRef} from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { useModal } from "../../context/Modal";
import {fetchCreateBudget, fetchEditBudget,fetchBudget} from '../../redux/budget';
import { fetchTransaction, fetchTransactions } from '../../redux/transaction';
import { fetchGoals } from '../../redux/goals';
import './BudgetForm.css';
import { fetchBudgetItemsByBudget } from '../../redux/budgetItem';

const BudgetForm = ({budget}) => {
    const inputRefs = useRef({
       name: null,
        startDate: null,
        endDate: null,
        budgetItems: ({})
    });
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const user = useSelector(state => state.session.user);
    const budgetItems = useSelector(state => state.budgetItems.budgetItems);
    const allTransactions = useSelector(state => state.transactions.allTransactions);
    const allGoals = useSelector(state => state.goals.allGoals);

    const [name, setName] = useState(budget?.name || '');
    const [startDate, setStartDate] = useState(budget?.start_date || '');
    const [endDate, setEndDate] = useState(budget?.end_date || '');
    // const [totalAmount, setTotalAmount] = useState(budget?.total_amount || 0);

    const [incomeOptions, setIncomeOptions] = useState([]);
    const [expenseOptions, setExpenseOptions] = useState([]);
    const [goalOptions, setGoalOptions] = useState([]);
    const [remainingBalance, setRemainingBalance] = useState(0);
    let [errors, setErrors] = useState({});
    let [isLoaded, setIsLoaded] = useState(false);

    //MATHS
    const [incomeItems, setIncomeItems] = useState([]);
    const [expenseItems, setExpenseItems] = useState([]);
    const [goalItems, setGoalItems] = useState([]);

    const transactions = Object.values(allTransactions);
    const goals = Object.values(allGoals);

    useEffect(() => {
        dispatch(fetchTransactions());
        dispatch(fetchGoals())
        .then(() => setIsLoaded(true));
    }, [dispatch]);

    useEffect(() => {
        if (budget?.id) {
            dispatch(fetchBudgetItemsByBudget(budget.id))
                .then(() => {
                    setName(budget.name);
                    setStartDate(budget.start_date);
                    setEndDate(budget.end_date);
                    setIsLoaded(true);
                });
        }
    }, [budget, dispatch]);

    
    useEffect(() => {
        if (budget && budgetItems) {
            const currIncomeItems = budgetItems.filter(item => item.transaction && !item.expense);
            const currExpenseItems = budgetItems.filter(item => item.transaction && item.expense);
            const currGoalItems  = budgetItems.filter(item => !item.transaction);

            if (currIncomeItems) setIncomeItems(currIncomeItems);
            if (currExpenseItems) setExpenseItems(currExpenseItems);
            const goalItemAmounts = currGoalItems?.map((goal) => ({
                ...goal,
                amount: goal.amount - goal.saved_amount
            })) || goalItems;
            if (goalItemAmounts) setGoalItems(goalItemAmounts);
        }
    }, [budget, budgetItems]);

    /*useEffect(() => {
        if (!startDate || !endDate || transactions.length === 0 || goals.length === 0) return;

        const sortIncomeItems = transactions.filter(
            item => !item.expense && new Date(item.date) >= new Date(startDate) && new Date(item.date) <= new Date(endDate)
        );
        const sortExpenseItems = transactions.filter(
            item => item.expense && new Date(item.date) >= new Date(startDate) && new Date(item.date) <= new Date(endDate)
        );
        const sortGoalItems = goals.map(goal => ({
            ...goal,
            amount: goal.amount - goal.saved_amount
        })).filter(goal =>
            new Date(goal.end_date) >= new Date(startDate) && new Date(goal.end_date) <= new Date(endDate)
        );

        setIncomeOptions(sortIncomeItems);
        setExpenseOptions(sortExpenseItems);
        setGoalOptions(sortGoalItems);

    }, [startDate, endDate, transactions, goals]);
    
*/

        /*
        if (inputRefs.current.name) {
                inputRefs.current.name.value = budget.name;
        }
        if (inputRefs.current.startDate) {
            inputRefs.current.startDate.value = budget.start_date;
        }
        if (inputRefs.current.endDate) {
            inputRefs.current.endDate.value = budget.end_date;
        }

        if(incomeItems.length > 0){
            incomeItems?.forEach((item, index) => {
                const assocParent = transactions.filter(transaction => transaction.id === item.id); 

                inputRefs.current.incomeItems[index].name.value = transactions[index].name || '';
                inputRefs.current.incomeItems[index].amount.value = transactions[index].amount || 0;
            });
        }
        if(expenseItems.length > 0){
            expenseItems?.forEach((item, index) => {
                inputRefs.current.expenseItems[index].name.value = item.name || '';
                inputRefs.current.expenseItems[index].amount.value = item.amount || 0;
            });
        }

        goalItemAmounts?.forEach((item, index) => {
            inputRefs.current.goalItems[index].name.value = item.name || '';
                inputRefs.current.goalItems[index].amount.value = item.amount || 0;
        });
        */



    //MATHS
    useEffect(() => {
        
        const totalIncome = incomeItems.reduce((sum, item) => sum + Number(item.amount), 0);
        const totalExpenses = expenseItems.reduce((sum, item) => sum + Number(item.amount), 0);
        const totalGoals = goalItems.reduce((sum, goal) => sum + Number(goal.amount),0);
        setRemainingBalance(totalIncome - (totalExpenses + totalGoals));
    }, [incomeItems, expenseItems, goalItems]);
    

    const addItem = (type) => {
        /*const newItem = {id: Date.now(), amount:0};
        if(type==='income'){
            setIncomeItems([...incomeItems, newItem]);
        } else if(type === 'expense') {
            setExpenseItems([...expenseItems, newItem]);
        } else if (type === 'goal'){
            setGoalItems([...goalItems, newItem])
        }*/
    }

    const removeItem = (type, id) => {
        /*if (type==='income'){
            setIncomeItems(incomeItems.filter((item) => item.id !== id))
        } else if (type==='expense'){
            setExpenseItems(expenseItems.filter((item) => item.id !== id))
        } else if (type==='goal'){
            setGoalItems(goalItems.filter((item) => item.id !== id))*/
    }

    const handleChange = (type, id, field, value) => {
            /*if(type === 'income'){
                setIncomeItems(incomeItems.map(item => item.id === id ? {...item, [field]: value}: item))
            } else if (type === 'expense') {
                setExpenseItems(expenseItems.map(item => item.id === id ? {...item, [field]: value}: item))
            } else if (type === 'goal'){
                setGoalItems(goalItems.map(item => item.id === id ? {...item, [field]:value}: item))
            }*/
    }

    const handleSubmit = async (e) => {
            /*e.preventDefault();

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
                */
        }
    return isLoaded ? (
            <div className='new-budget-page'>
                <h1>Budget Plan</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Budget Name:</label>
                        <input
                            name='name'
                            ref={(el) => (inputRefs.current.name = el)}
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Start Date:</label>
                        <input
                            name = 'startDate'
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
                            name='endDate'
                            ref={(el) => inputRefs.current.endDate = el}
                            type='date'
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </div>
                    {(incomeOptions) && (<section>
                        <h2>Income Sources</h2>
                        {incomeOptions.map((item, index) => (
                            <div key={item.id} className='budget-item'>
                                <p>{item.id}</p>
                                <button type='button' onClick={() => removeItem('income', item.id)}>Remove</button>
                            </div>
                        ))}
                        <button type='button' onClick={() => addItem('income')}>Add Income</button>
                    </section>) || (<p>Add Income Sources within Budget start date and end date to create a Budget Plan.</p>)}
                    
                    {(expenseOptions && incomeOptions) && (
                    <section>
                        <h2>Expenses</h2>
                        {expenseItems.map((item, index) => (
                            <div key={item.id} className='budget-item'>
                               <p>{item.id}</p>
                                <button type='button' onClick={() => removeItem('expense', item.id)}>Remove</button>
                            </div>
                        ))}
                        <button type='button' onClick={() => addItem('expense')}>Add Expense</button>
                    </section>
                    ) || (<p>Create more data within Budget start date and end date. </p>)}

                    {(goalOptions && incomeOptions) && (
                    <section>
                        <h2>Goals</h2>
                        {goalOptions.map((item, index) => (
                            <div key={item.id} className='budget-item'>
                                <p>ID: {item.id}</p>
                                <button type='button' onClick={() => removeItem('goal', item.id)}>Remove</button>
                            </div>
                        ))}
                        <button type='button' onClick={() => addItem('goal')}>Add Goal</button>
                    </section>
                    ) || (<p>Create more data within Budget start date and end date. </p>)}

                    <section className='remaining-balance'>
                        <h3>Remaining Balance  {remainingBalance}</h3>
                    </section>

                    <button type='submit'>{budget ? 'Edit' : 'Create'} Budget</button>
                </form>
            </div>
        ):(
            <h2>Loading Budget..</h2>
    )
};

export default BudgetForm;

/*
Goals has No amount.. make adjustments -- Goal total amount - saved amount. 
*/