import { csrfFetch } from "./csrf";

const GET_TRANSACTIONS = 'transactions/getAll';
const GET_TRANSACTION = 'transactions/getById';
const GET_EXPENSE_TYPES = '/expenseTypes/getAll';
const CREATE_TRANSACTION = 'transactions/create';
const EDIT_TRANSACTION = 'transactions/edit';
const DELETE_TRANSACTION = 'transactions/delete';


const getTransactions = (transactions) => ({
    type: GET_TRANSACTIONS,
    payload: transactions
});

const getTransaction = (transaction) => ({
    type: GET_TRANSACTION,
    payload: transaction
});
const getExpenseTypes = (expenseTypes) => ({
    type: GET_EXPENSE_TYPES,
    payload: expenseTypes
});

const createTransaction = (transaction) => ({
    type: CREATE_TRANSACTION,
    payload: transaction
});

const editTransaction = (transaction) => ({
    type: EDIT_TRANSACTION,
    payload: transaction
})

const deleteTransaction = (transactionId) => ({
    type: DELETE_TRANSACTION,
    payload: transactionId
});

export const fetchTransactions = () => async(dispatch) => {
    const res = await csrfFetch('/api/transactions');
    if(res.ok){
        const data = await res.json();
        dispatch(getTransactions(data));
        return res;
    }
    
}
export const fetchTransaction = (id) => async (dispatch) => {
    const res = await csrfFetch(`/api/transactions/${id}`);
    if(res.ok){
        const data = await res.json();
        await dispatch(getTransaction(data))
        return res;
    }
}

export const fetchExpenseTypes = () => async (dispatch) => {
    const res = await csrfFetch('/api/transactions/expenseTypes');
    const data = await res.json();
    dispatch(getExpenseTypes(data));
    return data;
}

export const fetchCreateTransaction = (transaction) => async (dispatch) => {
    const res = await csrfFetch('/api/transactions', {
        method: 'POST',
        body: JSON.stringify(transaction),
    });

        const newTransaction = await res.json();
        dispatch(createTransaction(newTransaction));
        return newTransaction;
};


export const fetchEditTransaction = (transaction) => async (dispatch) => {
    const { id, name, amount, date, frequency, expense, expense_type} = transaction;
    const res = await csrfFetch(`/api/transactions/${transaction.id}`, {
        method: 'PUT',
        body: JSON.stringify({ name, amount, date, frequency, expense, expense_type })
    });
    if (res.ok){
        const updatedTransaction = await res.json();
        dispatch(editTransaction(updatedTransaction));
        return updatedTransaction;
    } else {
        console.error('FAILED :[  ', res)
        return null;
    }
};

export const fetchDeleteTransaction = (transactionId) => async(dispatch) => {
    const res = await csrfFetch(`/api/transactions/${transactionId}`, {
        method: 'DELETE'
    });
    if(res.ok){
        dispatch(deleteTransaction(transactionId));
    }
};



const initialState = {
    allTransactions : {},
    currentTransaction: null,
    expenseTypes: []
}

const TransactionsReducer = (state = initialState, action) => {
    switch(action.type){
        case GET_TRANSACTIONS:
            return {...state, allTransactions: action.payload};
        case GET_TRANSACTION:
            return {...state, currentTransaction: action.payload};
        case GET_EXPENSE_TYPES:
            return {...state, expenseTypes: action.payload};
        case CREATE_TRANSACTION: {
            let newState = {...state};
            newState.allTransactions[action.payload.id] = action.payload;
            return newState;
        }
        case EDIT_TRANSACTION: {
            let newState = {...state};
            newState.allTransactions[action.payload.id] = action.payload;
            return newState;
        }
        case DELETE_TRANSACTION: {
            let newState = {...state};
            delete newState.allTransactions[action.payload];
            return newState;
        }
        default:
             return state;
    }
}

export default TransactionsReducer;