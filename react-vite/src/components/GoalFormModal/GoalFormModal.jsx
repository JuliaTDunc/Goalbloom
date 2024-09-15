import { fetchGoal, fetchCreateGoal, fetchEditGoal, fetchGoals } from '../../redux/goals';
import { useModal } from "../../context/Modal";
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate} from 'react-router-dom';
import './GoalFormModal.css';


function NewGoalFormModal({goal}){
    const inputRefs = useRef({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {closeModal} = useModal();

    //const goal = useSelector(state => state.goals.currentGoal)
    const user = useSelector(state=>state.session.user)

    const [goalData, setGoalData] = useState({
        name: '',
        amount: '',
        saved_amount: '',
        end_date: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(()=> {
        if(!user){
            navigate('/login')
        }
    }, [user,navigate]);

    useEffect(() => {
        if(goal?.id){
            dispatch(fetchGoal(goal.id))
        }
    }, [goal?.id, dispatch]);

    useEffect(() => {
        if(goal){
            setGoalData({
                name:goal.name || "",
                amount:goal.amount || "",
                saved_amount:goal.saved_amount || "",
                endDate:goal.end_date ? new Date(goal.end_date).toISOString().split('T')[0] : "",
            })
        } else{
            setGoalData({
                name: '',
                amount: '',
                saved_amount: '',
                end_date: ''
            });
        }
    }, [goal]);

    const validationErrors = () => {
        const newErrors = {};
        const { name, amount, saved_amount, end_date } = goalData;
        if (!name) newErrors.name = "Name this Goal."
        if (!amount) newErrors.amount = "Amount is required."
        if (!end_date) newErrors.end_date = "End Date id required."
        if (amount < 0) newErrors.amount = "Amount must be equal to or greater than 0."
        if (saved_amount > amount) newErrors.saved_amount = "Amount saved must be less than Goal Amount."
        return newErrors;
    }
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setGoalData((prevData => ({
            ...prevData,
            [name]: value
        })));
        if (errors[name]) {
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();  
        goalData.amount = Number(goalData.amount);
        goalData.saved_amount = Number(goalData.saved_amount);
        const formErrors = validationErrors();

        if(Object.keys(formErrors).length > 0){
            setErrors(formErrors);
            const firstErrorField = Object.keys(formErrors)[0];
            inputRefs.current[firstErrorField].scrollIntoView({behavior: 'smooth'})
        }else{
            try{
                if (goal) {
                    let goalId = goal.id
                    await dispatch(fetchEditGoal({...goalData, id:goalId}))
                    await dispatch(fetchGoals())
                } else {
                    await dispatch(fetchCreateGoal(goalData))
                }
                closeModal();
                dispatch(fetchGoals());
            }catch(error){
                console.log(error)
            }
            
        }
    }

    return (
        <div className='form-container'>
            <div className='goal-form-header'>
                <h3>{goal ? "Edit Goal" : "Create a New Goal"}</h3>
                <p> Savings Goal Form Description....</p>
            </div>
            <form onSubmit={handleSubmit} className='goal-form'>
                <div>
                    <label>Name
                        <input
                        type='text'
                        name='name'
                        value={goalData.name}
                        onChange={handleChange}
                        ref={(el) => (inputRefs.current.name = el)}
                        />
                        {errors.name && <p>{errors.name}</p>}
                    </label>
                </div>
                <div>
                    <label>Amount
                        <input
                            type='number'
                            name='amount'
                            value={goalData.amount}
                            onChange={handleChange}
                            ref={(el) => (inputRefs.current.amount = el)}
                        />
                        {errors.amount && <p>{errors.amount}</p>}
                    </label>
                    <label>Amount Saved
                        <input
                            type='number'
                            name='saved_amount'
                            value={goalData.saved_amount}
                            onChange={handleChange}
                            ref={(el) => (inputRefs.current.saved_amount = el)}
                        />
                        {errors.saved_amount && <p>{errors.saved_amount}</p>}
                    </label>
                </div>
                <div>
                    <label>
                        End Date
                        <input
                            type="date"
                            name='end_date'
                            value={goalData.end_date}
                            onChange={handleChange}
                            ref={(el) => (inputRefs.current.end_date = el)}
                        />
                        {errors.end_date && <p>{errors.end_date}</p>}
                    </label>
                </div>
                <div>
                    <button type="submit">Save Goal</button>
                </div>
            </form>

        </div>
    )
}

export default NewGoalFormModal;