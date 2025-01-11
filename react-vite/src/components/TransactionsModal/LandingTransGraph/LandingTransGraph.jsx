import React, { useState, useEffect } from 'react';
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
    const today = new Date();

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
        if (transactions.length) {

            const oneMonthAgo = new Date(today.setMonth(today.getMonth() - 1));

            const filteredTransactions = transactions.filter(transaction => {
                const transactionDate = new Date(transaction.date);
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
        };
    }, [transactions]);

    const options = {
        chart: {
            type: 'line',
        },
        title: {
            text: `${new Date().toLocaleString('default', { month: 'long' })} Overview`,
        },
        xAxis: {
            categories: graphData.income.map(item => item.name),
            title: {
                text: '',
            },
            labels:{
                enabled:false,
            }
        },
        yAxis: {
            title: {
                text: 'Amount',
            },
            min: 0,
        },
        series: [
            {
                name: 'Income',
                data: graphData.income.map(item => item.amount),
                color: '#9BBD9C',
            },
            {
                name: 'Expense',
                data: graphData.expense.map(item => item.amount),
                color: '#D66B6B',
            },
        ],
        plotOptions: {
            line: {
                marker: {
                    enabled:false,
                },
            },
        },
        legend: {
            enabled: false,
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
