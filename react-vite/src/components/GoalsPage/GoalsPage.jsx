import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import GoalCard from '../GoalCard';
import { fetchGoals } from '../../redux/goals';
import { useModal } from '../../context/Modal';
import NewGoalFormModal from '../GoalFormModal/GoalFormModal';
import LoginFormModal from '../LoginFormModal'
import './GoalsPage.css';
import {Goldblum2} from '../../images/Goldblum2.png'



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
                    <p className='goals-description'>Dreaming of that new gadget? Planning a trip? Or maybe just looking to save for a rainy day? Whatever it is, the Goals Page is where you can bring those dreams to life. Add your goals, track how close you are to reaching them, and watch as your progress fills up like a progress bar in a video game. Every little bit counts, and this page helps you see how far you’ve come—and how close you are to reaching the finish line.

                        Starting is as easy as setting your first goal and adding a few bucks toward it. You’ll see your savings grow, and with each update, you’ll feel more motivated to keep going. It’s your journey, your goals, your way. Keep it fun, keep it focused, and keep moving forward!</p>
            </section>
            <div className='add-goal'>
                <button onClick={openNewGoalModal} className='add-goal-button'>Add New Goal</button>
            </div>
            </header>
            <div className='goal-cards-grid'>
                  {goalsArr.map(goal => (
                    goal.saved_amount === goal.amount ? (
                    <div>{Goldblum2}</div>
                ):(
                <GoalCard key={goal.id} goal={goal} />
                )
                ))}
            </div>
        </div>
    ) : ( setModalContent(<LoginFormModal/>))
};
export default GoalsPage;