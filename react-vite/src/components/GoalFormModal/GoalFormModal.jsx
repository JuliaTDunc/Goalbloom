import { fetchGoal, fetchCreateGoal, fetchEditGoal } from '../../redux/goals';
import { useModal } from "../../context/Modal";
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import './GoalFormModal.css'
function NewGoalFormModal(){
    const {goalId} = useParams();
    const inputRefs = useRef({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {closeModal} = useModal();


    const goal = useSelector(state => state.goals.currentGoal)
    const user = useSelector(state=>state.session.user)

    let [name,setName] = useState("");
    let [amount,setAmount] = useState("");
    let [saved_amount,setSavedAmount] = useState("");
    let [end_date, setEndDate] = useState("");
    let [errors, setErrors] = useState({});
    let [isLoaded, setIsLoaded] = useState(false);

    const validationErrors = () => {
        const newErrors = {};
        if (!name) newErrors.name="Name this Goal."
        if (!amount) newErrors.amount="Amount is required."
        if (!end_date) newErrors.end_date="End Date id required."
        if (amount < 0) newErrors.amount="Amount must be equal to or greater than 0."
        if (saved_amount && saved_amount >= amount) newErrors.saved_amount="Amount saved must be less than Goal Amount."
        return newErrors;
    }
    useEffect(()=> {
        if(!user){
            navigate('/login')
        }
    }, [user,navigate]);

    useEffect(() => {
        if(goalId){
            dispatch(fetchGoal())
        }else{
            setIsLoaded(true);
        }
    }, [goalId, dispatch]);

    useEffect(() => {
        if(goal && goalId){
            setName(goal.name || "");
            setAmount(goal.amount || "");
            setSavedAmount(goal.saved_amount || "");
            setEndDate(goal.end_date ? new Date(goal.end_date).toISOString().split('T')[0] : "");
        }
    }, [goal, goalId]);

    const handleInputs = (set, field) => (e) => {
        set(e.target.value);
        if(errors[field]){
            setErrors((prevErrors) => {
                const newErrors ={ ...prevErrors};
                delete newErrors[field];
                return newErrors;
            })
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();  
        const formErrors = validationErrors();

        if(Object.keys(formErrors).length > 0){
            setErrors(formErrors);
            const firstErrorField = Object.keys(formErrors)[0];
            inputRefs.current[firstErrorField].scrollIntoView({behavior: 'smooth'})
        }else{
            const goalData = {
                name,
                amount,
                saved_amount,
                end_date
            };
            try{
                if (goalId) {
                    await dispatch(fetchEditGoal({ id: goalId, ...goalData }))
                    closeModal();
                } else {
                    await dispatch(fetchCreateGoal(goalData))
                    closeModal();
                }
            }catch(error){
                console.log(error)
            }
            
        }
    }

    return isLoaded ? (
        <div className='form-container'>
            <div className='goal-form-header'>
                <h3>Create a new saving goal</h3>
                <p> Savings Goal Form Description....</p>
            </div>
            <form onSubmit={handleSubmit} className='goal-form'>
                <div>
                    <label>Name
                        <input
                        type='text'
                        value={name}
                        onChange={handleInputs(setName, "name")}
                        ref={(el) => (inputRefs.current.name = el)}
                        />
                        {errors.name && <p>{errors.name}</p>}
                    </label>
                </div>
                <div>
                    <label>Amount
                        <input
                            type='number'
                            value={amount}
                            onChange={handleInputs(setAmount, "amount")}
                            ref={(el) => (inputRefs.current.amount = el)}
                        />
                        {errors.amount && <p>{errors.amount}</p>}
                    </label>
                    <label>Amount Saved
                        <input
                            type='number'
                            value={saved_amount}
                            onChange={handleInputs(setSavedAmount, "saved_amount")}
                            ref={(el) => (inputRefs.current.saved_amount = el)}
                        />
                        {errors.saved_amount && <p>{errors.savd_amount}</p>}
                    </label>
                </div>
                <div>
                    <label>
                        End Date
                        <input
                            type="date"
                            value={end_date}
                            onChange={handleInputs(setEndDate, "end_date")}
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
    ) : <div><h2>Loading....</h2></div>;
}

export default NewGoalFormModal;