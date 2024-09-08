import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import GoalCard from '../GoalCard';
import { fetchGoals } from '../../redux/goals';
import { useModal } from '../../context/Modal';
import NewGoalFormModal from '../GoalFormModal/GoalFormModal';
import './GoalsPage.css'



const GoalsPage = () => {
    const dispatch = useDispatch();
    const allGoals = useSelector(state => state.goals.allGoals);
    const { setModalContent } = useModal();

    useEffect(() => {
        dispatch(fetchGoals());
    }, [dispatch]);
    const goalsArr = Object.values(allGoals)
    
   
    const openNewGoalModal = () => {
        setModalContent(<NewGoalFormModal />);
    }

    if (!allGoals || goalsArr.length === 0) {
        return (
            <>
            <p>Add a new Goal to get started!</p>
                <div className='add-goal'>
                    <button onClick={openNewGoalModal} className='add-goal-button'>Add New Goal</button>
                </div>
            
            </>
        ) 
    }
  
    return (
        <div className="goals-page">
            <header className='goals-header'>
                <h4>Your Goals!</h4>
            <section className='goals-description'>
                <p>Track your savings goals!</p>
            </section>
            <div className='add-goal'>
                <button onClick={openNewGoalModal} className='add-goal-button'>Add New Goal</button>
            </div>
            </header>
            <div className='goal-cards-grid'>
                  {goalsArr.map(goal => (
                    <GoalCard key={goal.id} goal={goal} />
                ))}
            </div>
        </div>
    )
};
export default GoalsPage;