import React from 'react';
import Highcharts from 'highcharts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDeleteGoal, fetchGoals, fetchGoal } from '../../../redux/goals';
import {FaPencilAlt, FaRegTrashAlt} from 'react-icons/fa';
import confetti from 'canvas-confetti';
import HighchartsReact from 'highcharts-react-official';
import { useModal } from '../../../context/Modal';
import './GoalCard.css';
import Goldblum from '../../../images/Goldblum3.png';
import GoalForm from '../GoalForml/GoalForm';


const GoalCard = ({ goal }) => {

    const dispatch = useDispatch();
    const goals = useSelector(state => Object.values(state.goals.allGoals));
    const { setModalContent } = useModal();

    const openGoalModal = (goalId) => {
        const existingGoal = goals.find(goal => goal.id === goalId);
        if(existingGoal){
            dispatch(fetchGoal(goalId))
            .then(() => {
                setModalContent(<GoalForm goal={existingGoal}/>);
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

    const triggerConfetti = () => {
        const goalElement = document.querySelector('.goalbloom-reached');
        if (goalElement) {
            const rect = goalElement.getBoundingClientRect();
            const x = (rect.left + rect.right) / 2 / window.innerWidth;
            const y = (rect.top + rect.bottom) / 2 / window.innerHeight;

            confetti({
                particleCount: 100,
                spread: 70,
                origin: { x, y },
                colors: ['#7c04b0', '#e9e9f7', '#ed53ce', '#fa89f1','#9778ff','#020bfa']
            });
        }
    };
/*
    if (goal.saved_amount >= goal.amount) {
        triggerConfetti();
    }
*/

    return (goal.saved_amount < goal.amount) ? (
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
    ) : (<div className='goal-card'>
        <div className='goalbloom-reached'>
                <button className='goal-delete-button' onClick={() => handleDelete(goal.id)}><FaRegTrashAlt /></button>
                <img className='goldblum-goal' src={Goldblum} onLoad={triggerConfetti} />
                <p>This goal has been reached! Good Job!</p>
        </div>
    </div>);
};

export default GoalCard;
