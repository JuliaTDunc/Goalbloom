import React, {useEffect, useState, useRef} from 'react';
import {fetchTransaction, fetchCreateTransaction, fetchEditTransaction, fetchExpenseTypes, fetchTransactions} from '../../redux/transaction';
import { useModal } from "../../context/Modal";
import { useNavigate } from 'react-router-dom';
import './NewTransFormModal.css';
import { useDispatch, useSelector} from 'react-redux';

function NewTransactionFormModal({transaction}){
    const inputRefs = useRef({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {closeModal} = useModal();
    
    //FREQUENCY OPTIONS?


    const expenseTypeObj = useSelector(state => state.transactions.expenseTypes);
    const expenseTypes = Object.values(expenseTypeObj);
    const defaultET = expenseTypes[8]?.id || 9;
    const user = useSelector(state => state.session.user);

    let [name, setName] = useState("");
    let [amount, setAmount] = useState("");
    let [date, setDate] = useState("");
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
        return newErrors;
    }
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);
    
    useEffect(() => {
        dispatch(fetchExpenseTypes())

        if (transaction?.id) {
            dispatch(fetchTransaction(transaction.id))
            .then(() => setIsLoaded(true))
        } else {
            setIsLoaded(true);
        }

    }, [transaction?.id, dispatch]);

    useEffect(() => {
        if (transaction) {
            setName(transaction.name || "");
            setAmount(transaction.amount || ""); 
            setDate(transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : "");
            setFrequency(transaction.frequency || "once");
            setExpense(transaction.expense || false);
            setExpenseType(transaction.expenseType.id || "");
        }
    }, [transaction]);

    useEffect(() => {
        return () => {
            setName("");
            setAmount("");
            setDate("");
            setFrequency("once");
            setExpense(false);
            setExpenseType("");
            setErrors({});

             dispatch(fetchTransactions())
        };
    }, [closeModal, dispatch]);

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
        let transactionData = {};
        const formErrors = validationErrors();
        //frequency options prob best HERE. (or helper)

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            const firstErrorField = Object.keys(formErrors)[0];
            inputRefs.current[firstErrorField].scrollIntoView({ behavior: 'smooth' })
        }else{
            transactionData = {
                name,
                amount,
                date,
                frequency,
                expense,
                expense_type: expense ? expenseType : defaultET,
            };
            try {
                if(transaction){
                    let transId = transaction.id
                    await dispatch(fetchEditTransaction({id: transId, ...transactionData}))
                    await dispatch(fetchTransactions())
                    closeModal();
                    navigate(0);
                    
                }else{
                    await dispatch(fetchCreateTransaction(transactionData))
                        .then(() => {
                            dispatch(fetchTransactions())
                            navigate('/transactions')
                        })
                    closeModal();
                }
            } catch (error) {
                console.error(error)
            }
        }
    }
    /*   
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
    };*/

    return isLoaded ? (
        <div className='form-container'>
            <form onSubmit={handleSubmit} className="new-transaction-modal">
                {!transaction && (<div className='expense-container'>
                    <label>
                        Expense
                        <input
                            type="checkbox"
                            checked={expense}
                            onChange={(e) => setExpense(e.target.checked)}
                        />
                    </label>
                </div>)}
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
                {(expense && !transaction) && (
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
                                    <option key={type.id} value={type.id}>
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
    ) : <div><h2>Loading...</h2></div>;    
}

export default NewTransactionFormModal;