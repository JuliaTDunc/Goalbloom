import React from 'react';
import { useSelector } from 'react-redux';
import GoalCard from '../GoalCard';
import { useModal } from '../../context/Modal';
import NewGoalFormModal from '../GoalFormModal/GoalFormModal';
import './GoalsPage.css'



const GoalsPage = () => {
    const allGoals = useSelector(state => state.goals.allGoals);
    const goalsArr = Object.values(allGoals)
    const {setModalContent} = useModal();
   

    if (!allGoals || allGoals.length === 0) {
        return <p>No goals available</p>;
    }
  
    const openNewGoalModal = () => {
        setModalContent(<NewGoalFormModal />);
    }

    return (
        <div className="goals-page">
            <header className='goals-header'>
                <h4>Your Goals!</h4>
            </header>
            <section className='goals-description'>
                <p>Track your savings goals!</p>
            </section>
            <div className='add-goal'>
                <button onClick={openNewGoalModal} className='add-goal-button'>Add New Goal</button>
            </div>
            <div className='goal-cards-grid'>
                  {goalsArr.map(goal => (
                    <GoalCard key={goal.id} goal={goal} />
                ))}
            </div>
        </div>
    )
};
export default GoalsPage;