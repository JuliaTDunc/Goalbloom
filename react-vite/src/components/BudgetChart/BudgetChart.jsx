import React, {useState, useEffect, useMemo} from 'react';
import Highcharts from 'highcharts';
import { useDispatch, useSelector } from 'react-redux';
import HighchartsReact from 'highcharts-react-official';
import { fetchTransactions } from '../../redux/transaction';
import { fetchGoals } from '../../redux/goals';
import { fetchBudget } from '../../redux/budget';
import BudgetForm from '../BudgetForm';
import { FaPencilAlt } from 'react-icons/fa'
import { useModal } from '../../context/Modal';
import { fetchBudgetItemsByBudget } from '../../redux/budgetItem';
import './BudgetChart.css';



const BudgetGraph = ({budget}) => {

    const juliaApproved = false;



    const dispatch = useDispatch();
    const allBudgetItems = useSelector(state => state.budgetItems.budgetItems);
    const budgetItems = Object.values(allBudgetItems);
    const allTransactions = useSelector(state => state.transactions.allTransactions);
    const allGoals = useSelector(state => state.goals.allGoals);
    const transactions = Object.values(allTransactions);
    const goals = Object.values(allGoals);
    const { setModalContent } = useModal();
    const [isLoaded, setIsLoaded] = useState(false);

    const openEditBudgetModal = (budget) => {
        setModalContent(<BudgetForm budget={budget} />)
    };

    const [incomeItems, setIncomeItems] = useState([]);
    const [expenseItems, setExpenseItems] = useState([]);
    const [goalItems, setGoalItems] = useState([]);
    const [remainingBalance, setRemainingBalance] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);

    useEffect(() => {
        dispatch(fetchBudget(budget.id));
        dispatch(fetchBudgetItemsByBudget(budget.id));
        dispatch(fetchTransactions());
        dispatch(fetchGoals());
    }, [dispatch, budget.id]);

    useEffect(() => {
        if (budgetItems && transactions) {
            const transactionItems = budgetItems.filter(item => item.transaction);
            const currGoalItems = budgetItems.filter(item => !item.transaction);

            const currIncomeItems = transactionItems.map(item => {
                const relatedInc = transactions.find(transaction => transaction.id === item.item_id && !transaction.expense);
                return relatedInc ? { ...item, amount: relatedInc.amount } : null;
            }).filter(item => item !== null);

            const currExpenseItems = transactionItems.map(item => {
                const relatedExp = transactions.find(transaction => transaction.id === item.item_id && transaction.expense);
                return relatedExp ? { ...item, amount: relatedExp.amount, name: relatedExp.name } : null;
            }).filter(item => item !== null);

            if (JSON.stringify(currIncomeItems) !== JSON.stringify(incomeItems)) {
                setIncomeItems(currIncomeItems);
            }
            if (JSON.stringify(currExpenseItems) !== JSON.stringify(expenseItems)) {
                setExpenseItems(currExpenseItems);
            }
            const goalItemAmounts = currGoalItems.map(item => {
                const relatedGoal = goals.find(goal => goal.id === item.item_id)
                return relatedGoal ? { ...item, difference: (relatedGoal.amount - relatedGoal.saved_amount), name: relatedGoal.name } : null;
            }).filter(item => item !== null)

            if (JSON.stringify(goalItemAmounts) !== JSON.stringify(goalItems)) {
                setGoalItems(goalItemAmounts);
            }
        }
    }, [budget, budgetItems, transactions, goals, incomeItems, expenseItems, goalItems]);

    useEffect(() => {
        const totalIncome = incomeItems.reduce((sum, item) => sum + Number(item.amount), 0);
        const totalExpenses = expenseItems.reduce((sum, item) => sum + Number(item.amount), 0);
        const totalGoals = goalItems.reduce((sum, goal) => sum + Number(goal.difference), 0);
        setTotalIncome(totalIncome);
        setRemainingBalance(totalIncome - (totalExpenses + totalGoals));
    }, [incomeItems, expenseItems, goalItems]);

    const expensesData = expenseItems.map(item => ({
        name: item.name,
        y: (item.amount / totalIncome) * 100
    }));


    const goalsData = goalItems.map(item => ({
        name: item.name,
        y: ((item.difference / totalIncome) * 100)
    }));
    const remainingData = {name: 'Remaining Balance', y: (remainingBalance/totalIncome) * 100}


    const totalData = useMemo(() => [...expensesData, ...goalsData, remainingData], [
        expensesData,
        goalsData,
        remainingData,
    ]);

    useEffect(() => {
        if (totalData.length > 0) {
            setIsLoaded(true)
        }
    },[totalData]);

    const graphOptions = {
        chart: {
            type: 'pie',
            height: '400px',
        },
        backgroundColor: '#f3f37e',
        title: {
            text: `${budget.name}`
        },
        colors: [
            '#f87666',
            '#ffbd59',
            '#B8DBD9',
            '#57886c',
            '#c287e8',
            '#7765E3',
            '#960200',
            '#241E4E',
            '#E6ADEC',
        ],
        series: [
            {name: 'Expenses and Goals (change)',
                colorByPoint: true,
                data: totalData
            }
        ],
        tooltip: {
            pointFormat: '<b>{point.name}</b>: {point.y:.2f}'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels:{
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.y:.2f}'
                }
            }
        }
    };

    return isLoaded ? (
        <div className='budget-graph'>
            {(juliaApproved) && (<button className='edit-btn' onClick={() => openEditBudgetModal(budget)}>
                <FaPencilAlt />
            </button>)}
            <HighchartsReact highcharts={Highcharts} options={graphOptions} className='budget-chart'/>
        </div>
    ) : (<h2>Loading Data..</h2>)
}

export default BudgetGraph;