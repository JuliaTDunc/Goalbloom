import {csrfFetch} from './csrf'

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

const toDict = async (transactions) => {
    let orderedData = {};
    transactions.forEach(transaction => {
        orderedData[transaction.id] = transaction
    });
    return orderedData;
}

export const fetchTransactions = () => async(dispatch) => {
    const res = await csrfFetch('/api/transactions');
    if(res.ok){
        const data = await res.json();
        const orderedData = await toDict(data);
        dispatch(getTransactions(orderedData));
        //dispatch(getTransactions(data));
        return res;
    } else {
        console.error('Failed to fetch transactions:', res);
        return null;
    }
    
}
export const fetchTransaction = (id) => async (dispatch) => {
    const res = await csrfFetch(`/api/transactions/${id}`);
    if(res.ok){
        const data = await res.json();
        dispatch(getTransaction(data));
        return data;
    }else{
        console.error('Failed to fetch transaction :[' ,res);
        return null;
    }
}

export const fetchExpenseTypes = () => async (dispatch) => {
    const res = await csrfFetch('http://localhost:8000/api/transactions/expenseTypes');
    if(res.ok){
        const data = await res.json();
        dispatch(getExpenseTypes(data));
        return data;
    } else {
        console.error('Failed expense type fetch :[ ', res)
        return null;
    }
}

export const fetchCreateTransaction = (transaction) => async (dispatch) => {
    const res = await csrfFetch('/api/transactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify(transaction),
    });
    if (res.ok) {
        const newTransaction = await res.json();
        dispatch(createTransaction(newTransaction));
        return newTransaction;
    } else {
        console.error('Failed to create transaction:', res);
        return null;
    }
};


export const fetchEditTransaction = (transaction) => async (dispatch) => {
    const { id, name, amount, date, frequency, expense, expense_type} = transaction;
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
    currentTransaction: null,
    expenseTypes: []
}

const TransactionsReducer = (state = initialState, action) => {
    switch(action.type){
        case GET_TRANSACTIONS:
            return {...state, allTransactions: action.payload};
            /*
            case GET_TRANSACTIONS: {
            const normalizedData = {};
            action.payload.forEach((transaction) => {
                normalizedData[transaction.id] = transaction;
            });
            return { ...state, allTransactions: normalizedData };
        }*/
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