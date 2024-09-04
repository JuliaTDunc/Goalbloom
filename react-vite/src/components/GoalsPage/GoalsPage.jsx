import React from 'react';
import { useSelector } from 'react-redux';
import GoalCard from '../GoalCard';
import './GoalsPage.css'



const GoalsPage = () => {
    const allGoals = useSelector(state => state.goals.allGoals);
    const goalsArr = Object.values(allGoals)
   

    if (!allGoals || allGoals.length === 0) {
        return <p>No goals available</p>;
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
                <button className='add-goal-button'>Add New Goal</button>
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