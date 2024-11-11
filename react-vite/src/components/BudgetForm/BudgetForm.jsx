import React, {useState, useEffect, useRef} from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { useModal } from "../../context/Modal";
import {fetchCreateBudget, fetchEditBudget,fetchBudgets,fetchBudget} from '../../redux/budget';
import { fetchTransactions } from '../../redux/transaction';
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

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        if (isNaN(date)) return 'Invalid Date';
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };
    const removeQuotes = (dString) => {
        return dString;
    }
    const ymdFormatter = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`
    };
    const convertYMDToDate = (dateString) => {
        const [datePart] = dateString.split('T');
        const [year, month, day] = datePart.split('-');
        return `${year}-${month}-${day}`;
    };

    const user = useSelector(state => state.session.user);
    const budgetItems = useSelector(state => state.budgetItems.budgetItems);
    const allTransactions = useSelector(state => state.transactions.allTransactions);
    const allGoals = useSelector(state => state.goals.allGoals);

    const [name, setName] = useState(budget?.name || '');
    const [startDate, setStartDate] = useState(budget && budget.start_date ? convertYMDToDate(budget.start_date) : '');
    const [endDate, setEndDate] = useState(budget?.end_date || '');
    const [totalAmount, setTotalAmount] = useState(budget?.total_amount || 0);


    //Options for Form
    const [incomeOptions, setIncomeOptions] = useState([]);
    const [expenseOptions, setExpenseOptions] = useState([]);
    const [goalOptions, setGoalOptions] = useState([]);
    const [remainingBalance, setRemainingBalance] = useState(0);
    console.log("initial log", remainingBalance)
    let [errors, setErrors] = useState({});
    let [isLoaded, setIsLoaded] = useState(false);
    const [isFetched, setIsFetched] = useState(false);

    //MATHS
    const [incomeItems, setIncomeItems] = useState([]);
    const [expenseItems, setExpenseItems] = useState([]);
    const [goalItems, setGoalItems] = useState([]);

    const transactions = Object.values(allTransactions);
    const goals = Object.values(allGoals);

    useEffect(() => {
        if (budget?.id && !isFetched) {
            dispatch(fetchBudgetItemsByBudget(budget.id))
                .then(() => {
                    setIsFetched(true);
                    setName(budget.name);
                    setStartDate(convertYMDToDate(budget.start_date));
                    setEndDate(convertYMDToDate(budget.end_date));
                });
        }
    }, [budget, dispatch, isFetched]);

    useEffect(() => {
        dispatch(fetchTransactions());
        dispatch(fetchGoals())
        .then(() => {
            setIsLoaded(true)
        });
    }, [dispatch]);

    //set Options
    useEffect(() => {
        if (!startDate || !endDate || !transactions.length) return;
        const sortIncomeOptions = transactions.filter(
            item => !item.expense && removeQuotes(item.date) >= startDate && removeQuotes(item.date) <= endDate
        );
        const sortExpenseOptions = transactions.filter(
            item => item.expense && removeQuotes(item.date) >= startDate && removeQuotes(item.date) <= endDate
        );
        const sortGoalOptions = goals.map(goal => ({
            ...goal,
            difference: goal.amount - goal.saved_amount
        })).filter(goal =>
            new Date(goal.end_date) >= new Date(startDate) && new Date(goal.end_date) <= new Date(endDate)
        );
        setIncomeOptions(sortIncomeOptions)
        setExpenseOptions(sortExpenseOptions)
        setGoalOptions(sortGoalOptions)
        setIsLoaded(true);

    }, [startDate, endDate]);

    //set selected items
    useEffect(() => {
        if (budget && budgetItems && transactions) {
            const transactionItems = budgetItems.filter(item => item.transaction);
            const currGoalItems = budgetItems.filter(item => !item.transaction);

            const currIncomeItems = transactionItems.flatMap(item => {
                const relatedInc = transactions.filter(transaction => transaction.id === item.item_id && !transaction.expense);
                return relatedInc;
            }).filter(item => item !== null);


            const currExpenseItems = transactionItems.map(item => {
                const relatedExp = transactions.find(transaction => transaction.id === item.item_id && transaction.expense);
                return relatedExp || null;
            }).filter(item => item !== null);

            if (JSON.stringify(currIncomeItems) !== JSON.stringify(incomeItems)) {
                setIncomeItems(currIncomeItems);
            }
            if (JSON.stringify(currExpenseItems) !== JSON.stringify(expenseItems)) {
                setExpenseItems(currExpenseItems.length > 0 ? currExpenseItems : []);
            }
            const goalItemAmounts = currGoalItems.length > 0
                ? currGoalItems.map(item => {
                    const relatedGoal = goals.find(goal => goal.id === item.item_id);
                    return {...relatedGoal, difference:(relatedGoal.amount - relatedGoal.saved_amount)};
                }).filter(item => item !== null)
                : [];
            if (JSON.stringify(goalItemAmounts) !== JSON.stringify(goalItems)) {
                setGoalItems(goalItemAmounts);
            }
        }
    }, [budget, budgetItems, transactions, goals]);
   
    //MATHS -- REMAINING BALANCE
    useEffect(() => { 
        if(incomeItems.length){
            let totalIncome = incomeItems.reduce((sum, item) => sum + Number(item.amount), 0);
            let totalExpenses = expenseItems.reduce((sum, item) => sum + Number(item.amount), 0);
            let totalGoals = goalItems.reduce((sum, goal) => sum + Number(goal.amount), 0);
            setRemainingBalance(totalIncome - (totalExpenses + totalGoals));
            setTotalAmount(totalIncome);
        }
    }, [incomeItems, expenseItems, goalItems]);
    
 
    const addItem = (type, item) => {
        switch (type) {
            case 'income':
                setIncomeItems((prevItems) => [...prevItems, item]);
                break;
            case 'expense':
                setExpenseItems((prevItems) => [...prevItems, item]);
                break;
            case 'goal':
                setGoalItems((prevItems) => [...prevItems, item]);
                break;
            default:
                console.warn('Unknown item type:', type);
        }   
    }

    const removeItem = (type, id) => {
        console.log("look hereeee", incomeItems, expenseItems)
        switch (type) {
            case 'income':
                setIncomeItems((items) => items.filter((item) => item.id !== id));
                break;
            case 'expense':
                setExpenseItems((items) => items.filter((item) => item.id !== id));
                break;
            case 'goal':
                setGoalItems((items) => items.filter((item) => item.id !== id));
                break;
            default:
                console.warn('Unknown item type:', type);
        }
    }

    const handleItemClick = (type, item) => {
        const itemExists = (type, id) => {
            return type === 'income'
                ? incomeItems.some((income) => income.id === id)
                : type === 'expense'
                    ? expenseItems.some((expense) => expense.id === id)
                    : goalItems.some((goal) => goal.id === id);
        };
        if (itemExists(type, item.id)) {
            removeItem(type, item.id);
        } else {
            addItem(type, item);
        }
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        // Gather selected items
        const selectedItems = {
            income_ids: incomeItems.map(item => item.id),
            expense_ids: expenseItems.map(item => item.id),
            goal_ids: goalItems.map(item => item.id),
        };

        const budgetData = {
            name,
            start_date: startDate,
            end_date: endDate,
            total_amount: totalAmount,
            ...selectedItems,
        };

        console.log(budgetData)
        try {
            if (budget) {
                await dispatch(fetchEditBudget(budgetData, budget.id));
            } else {
                await dispatch(fetchCreateBudget(budgetData));
            }
            closeModal();
            dispatch(fetchBudgets());

        } catch (error) {
            setErrors({ submit: "Failed to save budget. Please try again." });
            console.error("Submission Error:", error);
        } 
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
                    {(incomeOptions.length) && (<section>
                        <h2>Income Sources</h2>
                        {incomeOptions.map((item) => (
                            <div key={item.id} className='budget-item'>
                                <button
                                    type="button"
                                    className={incomeItems.some(i => i.id === item.id) ? 'selected' : ''}
                                    onClick={() => handleItemClick('income', item)}
                                >
                                    {item.name} ${item.amount}
                                </button>
                                {incomeItems.some(i => i.id === item.id) && (
                                    <button type='button' onClick={() => handleItemClick('income', item.id)}>Remove</button>
                                )}
                            </div>
                        ))}
                    </section>) || (<p>Add Income Sources within Budget start date and end date to create a Budget Plan.</p>)}
                    
                    {(expenseOptions.length) && (
                    <section>
                        <h2>Expenses</h2>
                        {expenseOptions.map((item) => (
                            <div key={item.id} className='budget-item'>
                                <button
                                    type="button"
                                    className={expenseItems.some(i => i.id === item.id) ? 'selected' : ''}
                                    onClick={() => handleItemClick('expense', item)}
                                >
                                    {item.name} ${item.amount}
                                </button>
                                {expenseItems.some(i => i.id === item.id) && (
                                    <button type='button' onClick={() => handleItemClick('expense', item.id)}>Remove</button>
                                )}
                            </div>
                        ))}
                    </section>
                    ) || (<p>Create more data within Budget start date and end date. </p>)}

                    {(goalOptions.length && incomeOptions) && (
                    <section>
                        <h2>Goals</h2>
                        {goalOptions.map((item) => (
                            <div key={item.id} className='budget-item'>
                                <button
                                    type="button"
                                    className={goalItems.some(i => i.id === item.id) ? 'selected' : ''}
                                    onClick={() => handleItemClick('goal', item)}
                                >
                                    {item.name} ${item.difference}
                                </button>
                                {goalItems.some(i => i.id === item.id) && (
                                    <button type='button' onClick={() => handleItemClick('goal', item.id)}>Remove</button>
                                )}
                            </div>
                        ))}
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