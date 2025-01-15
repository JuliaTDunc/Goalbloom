import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import GoalCard from '../GoalCard';
import { fetchGoals } from '../../redux/goals';
import { useModal } from '../../context/Modal';
import NewGoalFormModal from '../GoalFormModal/GoalFormModal';
import LoginFormModal from '../LoginFormModal';
import RelatedArticles from '../ResourceLinks/RelatedArticles';
import './GoalsPage.css'



const GoalsPage = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const allGoals = useSelector(state => state.goals.allGoals);
    const goalsArr = Object.values(allGoals);
    const { setModalContent } = useModal();
    let userData;

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
    if (allGoals && goalsArr.length) {
        const userDataTotalAmount = goalsArr
            .reduce((sum, goal) => sum + parseFloat(goal.total_amount), 0);
        const userDataSaved = goalsArr
            .reduce((sum, goal) => sum + parseFloat(goal.saved_amount), 0);
        userData = {
            difference : (userDataTotalAmount - userDataSaved),
            totalAmount: userDataTotalAmount
        };
    }
  
    return user? (
        <div className="goals-page">
            <section className='goals-description animate__animated animate__slideInLeft'>
                <h2 className='feature-page-head'>Goals</h2>
                <div className='feature-head-divider'></div>
                <p className='goals-description'>Welcome to your Goals Page!</p>
                {!allGoals ? (<p className='feature-page-subhead'>Track all your savings goals here, and update as you get closer to your goals!</p>) :
                    <p className='feature-page-subhead'>Check out your goals down below</p>}
            </section>
            <div className='add-goal'>
                <button onClick={openNewGoalModal} className='feature-page-create-button'>New Goal</button>
            </div>
            <div className='goal-cards-grid'>
                  {goalsArr.map(goal => (
                    <GoalCard key={goal.id} goal={goal} />
                ))}
            </div>
            {/*<div className='helpful-resources'><p className='box-placeholder'>Helpful Resources</p></div>*/}
           {userData && <div className='related-articles-goals'><RelatedArticles userData={userData} /></div> }
        </div>
    ) : ( setModalContent(<LoginFormModal/>))
};
export default GoalsPage;