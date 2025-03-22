import { useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions} from '../../../../redux/transaction';
import { fetchGoals } from '../../../../redux/goals';
import './SnapshotData.css'

const SnapshotData = () => {
    const dispatch = useDispatch();
    const transactions = useSelector(state => Object.values(state.transactions.allTransactions));
    //const goals = useSelector(state => Object.values(state.goals.allGoals));
    const [transactionsLoaded, setTransactionsLoaded] = useState(false);
    //const [goalsLoaded, setGoalsLoaded] = useState(false);
    //const difference;
    const [spent, setSpent] = useState(0);
    const [spendDifference,setSpendDifference] = useState(0);
    //const [more,less] = useState('less');
    const [error, setError] = useState(null);
    const [hasInitialized, setHasInitialized] = useState(false);

    useEffect(() => {
            const fetchData = async () => {
                try {
                    await dispatch(fetchTransactions());
                        dispatch(fetchGoals());
                        //setGoalsLoaded(true)
                } catch (err) {
                    setError('An error occurred while fetching transactions.');
                }
            };
            fetchData();
        }, [dispatch]);

    useEffect(() => {
        if (!transactionsLoaded && transactions && transactions.length > 0) {
            const calculateExpenses = (startDate, endDate) => {
                return transactions
                    .filter(transaction => {
                        const transactionDate = new Date(transaction.date);
                        return transactionDate >= startDate && transactionDate <= endDate;
                    })
                    .filter(transaction => transaction.expense)
                    .reduce((sum, transaction) => sum + transaction.amount, 0);
            };

            const today = new Date();
            const firstOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const firstOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const lastOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            const expenseThisMonth = calculateExpenses(firstOfThisMonth, today);
            const expenseLastMonth = calculateExpenses(firstOfLastMonth, lastOfLastMonth);
            setSpent(expenseThisMonth);
            setSpendDifference(expenseLastMonth - expenseThisMonth);
            setTransactionsLoaded(true);
            setHasInitialized(true);
        }
            }, [transactions, transactionsLoaded]);
    
    /*useEffect(() => {
        if (!goalsLoaded && goals && goals.length > 0) {
            const today = new Date();
            const lastDayPrevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            const lastDayMonthBeforeLast = new Date(lastDayPrevMonth.getFullYear(), lastDayPrevMonth.getMonth(), 0);
            //find goals created or updated between lastDayPrevMonth and today
        }
    }, [goals, hasInitialized]);*/
    return hasInitialized && 
    <>
    <div className='snap-shot-data'>
        <div className='transactions-snapshot'>
            {(transactionsLoaded) &&
                <div className='current-spending'>
                        <p className='snapshot-text'>You've spent </p> <p className='snapshot-dollar'>${spent}</p> <p className='snapshot-text'>this month.</p>
                </div>
            }
            {(spendDifference > 0) &&
                <div className='spending-difference'>
                        <p className='snapshot-text'> That's </p><p className='snapshot-dollar'>${spendDifference}</p> <p className='snapshot-text'> less than last month!</p>
                </div>}
            {(spendDifference < 0) && 
                    <div className='spending-difference'>
                        <p className='snapshot-text'> That's </p><p className='snapshot-dollar-red' >${Math.abs(spendDifference)}</p> <p className='snapshot-text'> more than last month</p>
                </div>}
        </div>
        {/*(goalsLoaded && difference > 0) && 
            <div className='saved-monthly'>
                <p>You've saved</p> <p>(dollar)</p> <p>this month compared to last month!</p>
            </div>
        */}
        
    </div>
    </>
};

export default SnapshotData;
