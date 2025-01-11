import React, {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {FaToggleOn, FaToggleOff} from 'react-icons/fa'
import { fetchTransactions} from '../../../redux/transaction';
import './TransGraphModal.css';

const TransGraphModal = ({activeTab}) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const transactions = useSelector(state => Object.values(state.transactions.allTransactions));
    const [graphData, setGraphData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartType, setChartType] = useState(location.pathname === '/' ? 'line' : 'column');

    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(fetchTransactions());
                setLoading(false);
            } catch (err) {
                setError(` `);
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
                amount: transaction.amount,
                color: transaction.expense ? '#D66B6B' : '#9BBD9C'
            }));
            if (JSON.stringify(dataNameAmount) !== JSON.stringify(graphData)) {
                setGraphData(dataNameAmount);
            }
        }
    }, [transactions, activeTab, graphData]);

    const getChartColor = (chartType, activeTab) => {
        if (chartType === 'line') {
            if (activeTab === 'both'){
                return '#696969'
            }
            return activeTab === 'income' ? '#9BBD9C' : '#D66B6B';
        }
        return null;
    };
    
    const options = {
        chart: {
            type: chartType
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
            data: graphData.map(item => ({
                y:item.amount,
                color: item.color
            })),
            color: getChartColor(chartType, activeTab)
        }],
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            },
            line: {
                marker: {
                    enabled: true,
                    radius: 4
                }
            }
        },
        legend: {
            enabled: false
        }
    };
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const isLandingPage = location.pathname === '/';


    return (
        <div className='modal-container'>
            <div className='modal-content'>
                <div className='graph-container'>
                    {chartType === 'column' ? (
                        <FaToggleOn className='toggle-switch-chart' onClick={() => setChartType('line')} style={{ cursor: 'pointer', opacity: isLandingPage ? 0 : 1 }} />
                    ) : (
                            <FaToggleOff className='toggle-switch-chart' onClick={() => setChartType('column')} style={{ cursor:'pointer', opacity: isLandingPage ? 0 : 1 }} />
                    )}
                    <HighchartsReact highcharts={Highcharts} options={options} />
                </div>
            </div>
        </div>
    )
};

export default TransGraphModal;