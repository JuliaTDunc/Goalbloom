import React from 'react';
import Highcharts from 'highcharts';
import { useDispatch, useSelector } from 'react-redux';
import HighchartsReact from 'highcharts-react-official';

const BudgetGraph = ({budget}) => {
    const dispatch = useDispatch();
    const allBudgetItems = useSelector(state => state.budgetItems.budgetItems);
    const budgetItems = Object.values(allBudgetItems);

    const graphOptions = {
        chart: {
            type: 'pie',
            height: '600px',
        },
        title: {
            text: `${budget.name}`
        },

    };
    
    return (
        <div className='budget-graph'>
            <HighchartsReact highcharts={Highcharts} options={graphOptions}/>
            <button className='edit-btn' onClick={() => openEditBudgetModal(budget)}>
                Edit
            </button>
        </div>
    )
}

export default BudgetGraph;