import React, { useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { fetchTransactions } from '../../../redux/transaction';

const LandingPageTransactionsGraph = () => {
    const dispatch = useDispatch();
    const transactions = useSelector(state => Object.values(state.transactions.allTransactions));
    const [graphData, setGraphData] = useState({ income: [], expense: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasInitialized, setHasInitialized] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(fetchTransactions());
                setLoading(false);
            } catch (err) {
                setError('An error occurred while fetching transactions.');
                setLoading(false);
            }
        };
        fetchData();
    }, [dispatch]);

    useEffect(() => {
        if (!hasInitialized && transactions && transactions.length > 0) {
            const today = new Date();
            const oneMonthAgo = new Date(today.setMonth(today.getMonth() - 1));

            const filteredTransactions = transactions.filter(transaction => {
                const transactionDate = new Date(transaction.date);
                if(transactionDate >= oneMonthAgo){
                console.log(transactionDate, oneMonthAgo);
                }
                return transactionDate >= oneMonthAgo;
            });
            const incomeItems = filteredTransactions
                .filter(transaction => !transaction.expense)
                .map(transaction => ({
                    name: transaction.name,
                    amount: transaction.amount,
                }));

            const expenseItems = filteredTransactions
                .filter(transaction => transaction.expense)
                .map(transaction => ({
                    name: transaction.name,
                    amount: transaction.amount,
                }));
            setGraphData({ income: incomeItems, expense: expenseItems });
            setHasInitialized(true);
        }
    }, [transactions, hasInitialized]);

    const options = {
        chart: {
            type: 'line',
        },
        title: {
            text: `Monthly Overview`,
        },
        xAxis: {
            type: 'linear',
            min: 0,
            max: Math.max(graphData.income.length, graphData.expense.length) - 1,
            tickInterval: 1,
            labels: {
                enabled:false,
            },
            
        },
        yAxis: {
            title: {
                text: 'Amount',
            },
            min: 0,
            max: Math.max(
                ...graphData.income.map(item => item.amount),
                ...graphData.expense.map(item => item.amount)
            ) * 1.2
        },
        series: [
            {
                name: 'Income',
                data: graphData.income.map(item => item.amount),
                color: '#9BBD9C',
                marker:{
                    symbol:'circle'
                }
            },
            {
                name: 'Expense',
                data: graphData.expense.map(item => item.amount),
                color: '#D66B6B',
                marker: {
                    symbol: 'circle'
                }
            },
        ],
        plotOptions: {
            line: {
                marker: {
                    enabled: true,
                },
            },
        },
        legend: {
            enabled: true,
        },
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="landing-page-graph">
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};

export default LandingPageTransactionsGraph;
