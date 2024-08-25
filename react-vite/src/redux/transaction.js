import {csrfFetch} from './csrf'

const GET_TRANSACTIONS = 'transactions/getAll';
const GET_TRANSACTION = 'transactions/getById';
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
    const data = await res.json();
    dispatch(getTransactions(data));
    return res;
}

export const fetchCreateTransaction = (transaction) => async (dispatch) => {
    const { name, amount, date, frequency, expense, expense_type } = transaction;
    const res = await csrfFetch('/api/transactions', {
        method: 'POST',
        body: JSON.stringify({ name, amount, date, frequency, expense, expense_type })
    });
    const data = await res.json();
    if(res.ok){
        dispatch(createTransaction(data));
        return data;
    }
    return null;
}

export const fetchEditTransaction = (transaction) => async (dispatch) => {
    const { id, name, amount, date, frequency, expense, expense_type, data} = transaction;
    const res = await csrfFetch(`/api/transactions/${id}`, {
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
    currentTransaction: null
}

const TransactionsReducer = (state, initialState, action) => {
    switch(action.type){
        case GET_TRANSACTIONS:
            return {...state, allTransactions: action.payload};
        case GET_TRANSACTION:
            return {...state, currentTransaction: action.payload};
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