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
            backgroundColor: 'transparent',
        },
        title: {
            text: null,
        },
        xAxis: {
            categories: [''], // Add a blank category to ensure the bar appears
            visible: false,
        },
        yAxis: {
            max: 100,
            visible: false,
        },
        series: [{
            data: [calculateProgress(goal)],
            color: '#55BF3B',
            showInLegend: false,
        }],
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: false,
                },
                borderWidth: 0,
                groupPadding: 0.1,
                pointPadding: 0.1,
            },
        },
        credits: {
            enabled: false,
        },
    };

    return (
        <div className="goal-card">
            <h3>{goal.name}</h3>
            <HighchartsReact
                highcharts={Highcharts}
                options={graphOptions}
            />
        </div>
    );
};

export default GoalCard;
