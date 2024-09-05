import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './GoalCard.css';


const GoalCard = ({ goal }) => {

    const calculateProgress = (goal) => {
        if (goal.amount === 0) return 0;
        return Math.min((goal.saved_amount / goal.amount) * 100, 100);
    };

    const graphOptions = {
        chart: {
            type: 'bar',
            height: '100%',
        },
        title: {
            text: 'saved',
        },
        xAxis: {
            categories: ['amount saved', 'total amount'], // Add a blank category to ensure the bar appears
        },
        yAxis: {
            max: 100,
        },
        series: [{
            data: [calculateProgress(goal)],
            color: '#55BF3B',
        }],
        plotOptions: {
            bar: {
                dataLabels:{
                    enabled: true
                },
                borderWidth: 0,
                groupPadding: 0.1,
                pointPadding: 0.1,
            },
        }
    };

    return (
        <div className="goal-card">
            <h3>{goal.name}</h3>
            <HighchartsReact
                highcharts={Highcharts}
                options={graphOptions}
            />
            <button>Edit</button>
            <button>Delete</button>
        </div>
    );
};

export default GoalCard;
