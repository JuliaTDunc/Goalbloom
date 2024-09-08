import React, {useState} from 'react';
import Highcharts from 'highcharts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDeleteGoal, fetchGoals, fetchGoal } from '../../redux/goals';
import {FaPencilAlt, FaRegTrashAlt} from 'react-icons/fa'
import HighchartsReact from 'highcharts-react-official';
import { useModal } from '../../context/Modal';
import './GoalCard.css';
import NewGoalFormModal from '../GoalFormModal/GoalFormModal';


const GoalCard = ({ goal }) => {
    const dispatch = useDispatch();
    const goals = useSelector(state => Object.values(state.goals.allGoals));
    const { setModalContent } = useModal();

    const openGoalModal = (goalId) => {
        const existingGoal = goals.find(goal => goal.id === goalId);
        if(existingGoal){
            dispatch(fetchGoal(goalId))
            .then(() => {
                setModalContent(<NewGoalFormModal />);
            })
        }
    }

    const handleDelete = (goalId) => {
        dispatch(fetchDeleteGoal(goalId))
            .then(() => {
                dispatch(fetchGoals());
            })
            .catch((error) => {
                console.error('Failed to delete goal:', error);
            });
    };

    const graphOptions = {
        chart: {
            type: 'column',
            height: '300px',
        },
        title: {
            text: `${goal.name} Progress`,
        },
        xAxis: {
            categories: ['Amount Saved vs. Goal'],
        },
        yAxis: {
            title: {
                text: 'Amount'
            },
            max: goal.amount,
            tickInterval: goal.amount/5,
        },
        series: [{
            name: 'Saved Amount',
            data: [goal.saved_amount],
            color: '#9BBD9C', 
        },{
            name: 'Remaining',
            data: [goal.amount - goal.saved_amount],
            color: '#D66B6B',
        }],
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                },
            }
        }
    };

    return (
        <div className="goal-card">
            <HighchartsReact
                highcharts={Highcharts}
                options={graphOptions}
            />
            <div className='button-container'>
                <button className='goal-edit-button' onClick={() => openGoalModal(goal.id)}><FaPencilAlt/></button>
                <button className='goal-delete-button' onClick={() => handleDelete(goal.id)}><FaRegTrashAlt/></button>
            </div>
        </div>
    );
};

export default GoalCard;
