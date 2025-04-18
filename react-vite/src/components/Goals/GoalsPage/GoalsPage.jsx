import React, {useState, useMemo, useEffect} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import {FaThLarge, FaThList} from 'react-icons/fa'
import GoalCard from '../GoalCard';
import { fetchGoals } from '../../../redux/goals';
import { useModal } from '../../../context/Modal';
import GoalForm from '../GoalForm/GoalForm';
import LoginFormModal from '../../Auth/LoginFormModal';
import RelatedArticles from '../../Education/ResourceLinks/RelatedArticles';
import './GoalsPage.css'



const GoalsPage = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const allGoals = useSelector(state => state.goals.allGoals);
    const goalsArr = useMemo(() => Object.values(allGoals), [allGoals]);
    const [listStyle, setListStyle] = useState('grid');
    const [currGoal,setCurrGoal] = useState(null);
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

    useEffect(() => {
        if(currGoal){
            return;
        }else if(!currGoal && goalsArr.length){
            console.log('yellow' ,goalsArr[goalsArr.length-1])
            setCurrGoal(goalsArr[goalsArr.length - 1]);
        }
    }, [goalsArr, currGoal])
   
    const openNewGoalModal = () => {
        setModalContent(<GoalForm goal={null}/>);
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
            <section className='goals-middle-section'>
                <div className='goal-opt-page'>
                    <div className='goal-list-options'>
                        <FaThLarge onClick={() => setListStyle('grid')} /> <FaThList onClick={() => setListStyle('list')} />
                    </div>
                    <div className='add-goal'>
                        <button onClick={openNewGoalModal} className='feature-page-create-button'>New Goal</button>
                    </div>
                </div>
                {(listStyle === 'grid' && 
                <div className='goal-cards-grid'>
                    {goalsArr.map(goal => (
                        <GoalCard key={goal.id} goal={goal} onClick={() => setCurrGoal(goal)}/>
                    ))}
                </div>)}
                {(currGoal && listStyle === 'list') ?
                (<div className='goal-list'>
                        <div className='goal-list-container'>
                            {goalsArr
                                .sort((a, b) => new Date(a.end_date) - new Date(b.end_date))
                            .map((goal) => (
                                <div
                                    className='goal-list-item'
                                    key={goal.id}
                                    onClick={() => setCurrGoal(goal)}
                                >
                                    <p className='goal-name'>{goal.name}</p>
                                    <div className='goal-amount'>
                                        <p style={{ color: '#317b31' }}>{goal.saved_amount}</p><p>/</p><p style={{color:'#bf442e'}}>{goal.amount}</p>
                                    </div>
                                    <p className='goal-date'>{goal.end_date}</p>
                                </div>
                            ))}
                        </div>
                        <div className='highlighted-goal'>
                            <GoalCard className='highlighted-goal-card' goal={currGoal} />
                        </div>
                </div>) : null}
                
            </section>
            {/*<div className='helpful-resources'><p className='box-placeholder'>Helpful Resources</p></div>*/}
           {userData && <div className='related-articles-goals'><RelatedArticles userData={userData} /></div> }
        </div>
    ) : ( setModalContent(<LoginFormModal/>))
};
export default GoalsPage;