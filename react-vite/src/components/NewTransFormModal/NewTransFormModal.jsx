import {useEffect, useState, useRef} from 'react';
import {fetchTransaction, fetchCreateTransaction, fetchEditTransaction} from '../../redux/transactions';
import { useParams } from 'react-router-dom';
import './NewTransFormModal.css';
import { useDispatch, useSelector } from 'react-redux';

function NewTransactionFormModal(){
    const {transactionId} = useParams();
    const inputRefs = useRef({});
    const dispatch = useDispatch();
    
    //FREQUENCY OPTIONS?


    const expenseTypeObj = useSelector(state => state.transactions.expense_types);
    const expenseTypes = Object.values(expenseTypeObj);
    const transaction = useSelector(state.transactions.currTrans);
    const user = useSelector(state => state.session.user);

    const [name, setName] = useState("");
    const [amount, setAmount] = useState();
    const [date, setDate] = useState();
    const [frequency, setFrequency] = useState("");
    const [expense, setExpense] = boolean(False);
    const [expenseType, setExpenseType] = useState("");
    const [errors, setErrors] = useState({});
}

const validationErrors = () => {
    const newErrors = {};
    if(!name) newErrors.name = "Name this Transaction.";
    if(!amount) newErrors.amount = "Amount is required.";
    if (!date) newErrors.date = "Date is required.";
    if (!frequency) newErrors.frequency = "Frequency is required.";
    //Length error
    if(amount <= 0) newErrors.amount = "Amount must be greater than 0.";
    // date before today's date or later than 3 years from now
    //FOR EXPENSES ONLY 
    if (!expense_type) newErrors.expense_type = "Category is required.";
}

useEffect(() => {
    if(transactionId){
        dispatch(fetchTransaction(transactionId)).then(() => setIsLoaded(true))
    }else{
        setIsLoaded(true);
    }
}, [productId, dispatch]);

useEffect(() => {
    if(transaction && transactionId){
        setName = (transaction.name || "");
        setAmount = (transaction.amount || 1); //What if i want this to appear blank on the form?
        setDate = (transaction.date || /*HELP WITH THIS LINE PLEASE*/"Date : prefereably blank before client clicks");
        setFrequency = (transaction.frequency || "once");
        //EXPENSES ONLY
        setExpenseType = (transaction.expense_type || /*HELP WITH THIS LINE*/ "Rent");


    }
}, [transaction, transactionId]);

const handleInputs = (set, field) => (e) => {
    set(e.target.value);
    if(errors[field]){
        setErrors((prevErrors) => {
            const newErrors = {...prevErrors};
            delete newErrors[field];
            return newErrors;
        })
    }
};

const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validationErrors();

    if (Object.keys(formErrors).length > 0){
        setErrors(formErrors);
        const firstErrField = Object.keys(formErrors)[0];
        inputRefs.current[firstErrField].scrollIntoView({behavior: 'smooth'})
    } else {
        const transactionData = {
            name,
            amount,
            date,//convert to corrent format
            frequency,
            //expense and expense_type?
        };
    }
}