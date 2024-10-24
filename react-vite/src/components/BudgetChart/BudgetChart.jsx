import React from 'react';
import Highcharts from 'highcharts';
import { useDispatch, useSelector } from 'react-redux';
import HighchartsReact from 'highcharts-react-official';
import BudgetForm from '../BudgetForm';
import { useModal } from '../../context/Modal';



const BudgetGraph = ({budget}) => {
    const dispatch = useDispatch();
    const allBudgetItems = useSelector(state => state.budgetItems.budgetItems);
    const budgetItems = Object.values(allBudgetItems);
    const { setModalContent } = useModal();

    const openEditBudgetModal = (budget) => {
        setModalContent(<BudgetForm budget={budget} />)
    };

    const graphOptions = {
        chart: {
            type: 'pie',
            height: '600px',
        },
        title: {
            text: `${budget.name}`
        },
        series: [
            {name: 'Income',
                colorByPoint: true,
                data: [
                    {name: 'Example1', y:30},
                    {name: 'Example2',y:50},
                    {name: 'Example3', y:70}
                ]
            }
        ],
        tooltip: {
            pointFormat: '<b>{point.name}</b>: {point.percenage.1f} %'
        }
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