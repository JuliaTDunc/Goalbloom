import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { fetchTransactions} from '../../../redux/transaction';

const TransGraphModal = ({activeTab}) => {
    const dispatch = useDispatch();
    const transactions = useSelector(state => Object.values(state.transactions.allTransactions));
    const [graphData, setGraphData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(fetchTransactions());
                setLoading(false);
            } catch (err) {
                setError('Failed to load data');
                setLoading(false);
            }
        };
        fetchData();
    }, [dispatch]);
    
    useEffect(() => {
        if (transactions.length) {
            const filteredTrans = transactions.filter(transaction => {
                if (activeTab === 'income' && !transaction.expense) return true;
                if (activeTab === 'expense' && transaction.expense) return true;
                if (activeTab === 'both') return true;
                return false;
            });

            const dataNameAmount = filteredTrans.map(transaction => ({
                name: transaction.name,
                amount: transaction.amount
            }));
            if (JSON.stringify(dataNameAmount) !== JSON.stringify(graphData)) {
                setGraphData(dataNameAmount);
            }
        }
    }, [transactions, activeTab, graphData]);
    
    const options = {
        chart: {
            type: 'column'
        },
        title: {
            text: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Overview`
        },
        xAxis: {
            categories: graphData.map(item => item.name),
            title: {
                text: 'Transaction'
            }
        },
        yAxis: {
            title: {
                text: 'Amount'
            },
            min: 0
        },
        series: [{
            name: 'Amount',
            data: graphData.map(item => item.amount),
            color: '#7cb5ec'
        }],
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        }
    };
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className='modal-container'>
            <div className='modal-content'>
                <div className='graph-container'>
                    <HighchartsReact highcharts={Highcharts} options={options} />
                </div>
            </div>
        </div>
    )
};

export default TransGraphModal;
/*
setChartOptions({
    chart: {
        type: 'bar'
    },
    title: {
        text: title
    },
    xAxis: {
        categories: ['Category 1', 'Category 2', 'Category 3'] // Replace with actual categories
    },
    yAxis: {
        title: {
            text: 'Amount'
        }
    },
    series: activeTab === 'both' ? data : [{ name: title, data }]
});
        };*/