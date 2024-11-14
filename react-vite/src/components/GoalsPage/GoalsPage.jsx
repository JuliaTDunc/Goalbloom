import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import GoalCard from '../GoalCard';
import { fetchGoals } from '../../redux/goals';
import { useModal } from '../../context/Modal';
import NewGoalFormModal from '../GoalFormModal/GoalFormModal';
import LoginFormModal from '../LoginFormModal'
import './GoalsPage.css'



const GoalsPage = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const allGoals = useSelector(state => state.goals.allGoals);
    const goalsArr = Object.values(allGoals)
    const { setModalContent } = useModal();

    useEffect(() => {
        dispatch(fetchGoals());
    }, [dispatch]);
    
    useEffect(() => {
        if (user) {
            dispatch(fetchGoals());
        }
    }, [dispatch, user]);
   
    const openNewGoalModal = () => {
        setModalContent(<NewGoalFormModal goal={null}/>);
    }
  
    return user? (
        <div className="goals-page">
            <header className='goals-header'>
                <h4 className='goals-page-head'>Your Goals!</h4>
            <section className='goals-description-container'>
                    <p className='goals-description'>Welcome to your Goals Page! <br/>Track all your savings goals here, and update as you get closer to your goals!</p>
            </section>
            </header>
            <div className='add-goal'>
                <button onClick={openNewGoalModal} className='add-goal-button'>Add New Goal</button>
            </div>
            <div className='goal-cards-grid'>
                  {goalsArr.map(goal => (
                    <GoalCard key={goal.id} goal={goal} />
                ))}
            </div>
            <div className='helpful-resources'><p className='box-placeholder'>Helpful Resources</p></div>
            <div className='related-articles'><p className='box-placeholder'>Related Articles</p></div> 
        </div>
    ) : ( setModalContent(<LoginFormModal/>))
};
export default GoalsPage;