import React, {useEffect, useState, useRef} from 'react';
import { csrfFetch } from '../../redux/csrf';
import {fetchTransaction, fetchCreateTransaction, fetchEditTransaction, fetchExpenseTypes} from '../../redux/transaction';
import { useModal } from "../../context/Modal";
import { useParams, useNavigate } from 'react-router-dom';
import './NewTransFormModal.css';
import { useDispatch, useSelector } from 'react-redux';

function NewTransactionFormModal(){
    const {transactionId} = useParams();
    const inputRefs = useRef({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {closeModal} = useModal();
    
    //FREQUENCY OPTIONS?


    const expenseTypeObj = useSelector(state => state.transactions.expenseTypes);
    const expenseTypes = Object.values(expenseTypeObj);
    const transaction = useSelector(state => state.transactions.currentTransaction);
    const user = useSelector(state => state.session.user);

    let [name, setName] = useState("");
    let [amount, setAmount] = useState();
    let [date, setDate] = useState();
    let [frequency, setFrequency] = useState("once");
    let [expense, setExpense] = useState(false);
    let [expenseType, setExpenseType] = useState("");
    let [errors, setErrors] = useState({});
    let [isLoaded, setIsLoaded] = useState(false);

    const validationErrors = () => {
        const newErrors = {};
        if (!name) newErrors.name = "Name this Transaction.";
        if (!amount) newErrors.amount = "Amount is required.";
        if (!date) newErrors.date = "Date is required.";
        if (!frequency) newErrors.frequency = "Frequency is required.";
        if (amount <= 0) newErrors.amount = "Amount must be greater than 0.";
        if (expense && !expenseType) newErrors.expenseType = "Category is required."
        return newErrors;
    }
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);
    
    useEffect(() => {
        dispatch(fetchExpenseTypes());

        if (transactionId) {
            dispatch(fetchTransaction(transactionId)).then(() => setIsLoaded(true))
        } else {
            setIsLoaded(true);
        }

    }, [transactionId, dispatch]);

    useEffect(() => {
        if (transaction && transactionId) {
            setName(transaction.name || "");
            setAmount(transaction.amount || ""); 
            setDate(transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : "");
            setFrequency(transaction.frequency || "once");
            setExpense(transaction.expense || false);
            setExpenseType(transaction.expense_type || "");
        }
    }, [transaction, transactionId]);

    const handleInputs = (set, field) => (e) => {
        set(e.target.value);
        if (errors[field]) {
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors[field];
                return newErrors;
            })
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validationErrors();
        //I believe frequency options would be best HERE. (or helper)

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            const firstErrorField = Object.keys(formErrors)[0];
            inputRefs.current[firstErrorField].scrollIntoView({ behavior: 'smooth' })
        }else{
            const transactionData = {
                name,
                amount: expense ? -Math.abs(amount) : amount,
                date,
                frequency,
                expense,
                expense_type: expenseType || null,
            };
            try {
                if(transactionId){
                    await dispatch(fetchEditTransaction({id: transactionId, ...transactionData}))
                    closeModal();
                }else{
                    const newTransaction = await dispatch(fetchCreateTransaction(transactionData))
                    
                }
            } catch (error) {
                
            }
        }
    }
       
    const handleEditSequence = async (editType) => {
        const transactionData = {
            name,
            amount: expense ? -Math.abs(amount) : amount,
            date,
            frequency,
            expense,
            expense_type: expenseType || null,
            edit_type: editType,
        };

        await dispatch(fetchEditTransaction({ ...transactionData, id: transactionId, editType }));
        history.push('/transactions');
    };

    if (!isLoaded) return <div>Loading...</div>;

    return isLoaded ? (
        <div className='form-container'>
            <form onSubmit={handleSubmit} className="new-transaction-form-modal">
                <div>
                    <label>Name
                        <input
                            type="text"
                            value={name}
                            onChange={handleInputs(setName, "name")}
                            ref={(el) => (inputRefs.current.name = el)}
                        />
                        {errors.name && <p>{errors.name}</p>}
                    </label>
                </div>
                <div>
                    <label>
                        Amount
                        <input
                            type="number"
                            value={amount}
                            onChange={handleInputs(setAmount, "amount")}
                            ref={(el) => (inputRefs.current.amount = el)}
                        />
                        {errors.amount && <p>{errors.amount}</p>}
                    </label>
                </div>
                <div>
                    <label>
                        Date
                        <input
                            type="date"
                            value={date}
                            onChange={handleInputs(setDate, "date")}
                            ref={(el) => (inputRefs.current.date = el)}
                        />
                        {errors.date && <p>{errors.date}</p>}
                    </label>
                </div>
                <div>
                    <label>
                        Frequency
                        <select
                            value={frequency}
                            onChange={handleInputs(setFrequency, "frequency")}
                            ref={(el) => (inputRefs.current.frequency = el)}
                        >
                            <option value="once">Once</option>
                            <option value="weekly">Weekly</option>
                            <option value="two-weeks">Every 2 Weeks</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                        {errors.frequency && <p>{errors.frequency}</p>}
                    </label>
                </div>
                <div>
                    <label>
                        Expense
                        <input
                            type="checkbox"
                            checked={expense}
                            onChange={(e) => setExpense(e.target.checked)}
                        />
                    </label>
                </div>
                {expense && (
                    <div>
                        <label>
                            Category
                            <select
                                value={expenseType}
                                onChange={handleInputs(setExpenseType, "expenseType")}
                                ref={(el) => (inputRefs.current.expenseType = el)}
                            >
                                <option value="">Select Category</option>
                                {expenseTypes.map((type) => (
                                    <option key={type.id} value={type.name}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                            {errors.expenseType && <p>{errors.expenseType}</p>}
                        </label>
                    </div>
                )}

                <button type="submit">Save Transaction</button>
            </form>
        </div>
    ) : <div>Loading...</div>;    
}

export default NewTransactionFormModal;


//HANDLE SUBMIT DRAFTS

/* e.preventDefault();
        const formErrors = validationErrors();

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            inputRefs.current[Object.keys(formErrors)[0]].scrollIntoView({ behavior: 'smooth' });
        } else {
            const transactionData = {
                name,
                amount: expense ? -Math.abs(amount) : amount,
                date,
                frequency,
                expense,
                expense_type: expenseType || null,
            };

            if (transactionId) {
                await handleEditTransaction(transactionData);
            } else {
                await handleCreateTransaction(transactionData);
            }
            
            navigate('/transactions');
            closeModal();
        }*/
/*
 
try {
    const response = await csrfFetch('/api/transactions', {
        method: 'POST',
        body: JSON.stringify(transaction),
    })
    if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData);
    }
} catch (error) {
    console.error("Submit Error:", error);
}
};
*/