import { csrfFetch } from "./csrf";

const GET_BUDGETS = 'budgets/getAll';
const GET_BUDGET = 'budgets/getById';
const CREATE_BUDGET = 'budgets/create';
const EDIT_BUDGET = 'budgets/edit';
const DELETE_BUDGET = 'budgets/delete';
//const CREATE_SUMMARY = 'budgets/createSummary';

const getBudgets = (budgets) => ({
    type: GET_BUDGETS,
    payload: budgets
});
const getBudget = (budget) => ({
    type: GET_BUDGET,
    payload: budget
});
const createBudget = (budget) => ({
    type: CREATE_BUDGET,
    payload: budget
});
const editBudget = (budget) => ({
    type: EDIT_BUDGET,
    payload: budget
});
/*const createSummary = (budget) => ({
    type: CREATE_SUMMARY,
    payload: budget
})*/
const deleteBudget = (budgetId) => ({
    type: DELETE_BUDGET,
    payload: budgetId
});

const toDict = async (budgets) => {
    let orderedData = {};
    budgets.forEach(budget => {
        orderedData[budget.id] = budget
    });
    return orderedData;
}

export const fetchBudgets = () => async(dispatch) => {
    const res = await csrfFetch('/api/budgets');
    const data = await res.json();
    const testData = await toDict(data);
    dispatch(getBudgets(testData));
    return res;
}
export const fetchBudget = (id) => async(dispatch) => {
    const res = await csrfFetch(`/api/budgets/${id}`);
        const data = await res.json()
        await dispatch(getBudget(data))
        return res;
}
export const fetchCreateBudget = (budget) => async (dispatch) => {
    const res = await csrfFetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budget)
    });
    if (res.ok) {
        const newBudget = await res.json();
        dispatch(createBudget(newBudget));
        return newBudget;
    } else {
        const error = await res.json();
        return error;
    }
};

export const fetchEditBudget = (budget, budgetId) => async(dispatch) => {
    const res = await csrfFetch(`/api/budgets/${budgetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budget)
    });
    if (res.ok) {
        const updatedBudget = await res.json();
        dispatch(editBudget(updatedBudget));
        console.log('updated budget', updatedBudget)
        return updatedBudget;
    } else {
        const error = await res.json();
        return error;
    }
};
/*export const fetchSummary = (currBudget) => async(dispatch) => {
    const res = await csrfFetch(`/api/budgets/${currBudget.budgetDetails.id}/summary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budget_details: currBudget.budgetDetails }),
    });

    if (res.ok) {
        const summary = await res.json();
        dispatch(createSummary(summary));
        return summary;
    } else {
        const error = await res.json();
        return error;
    }
};*/

export const fetchDeleteBudget = (budgetId) => async(dispatch) => {
    const res = await csrfFetch(`/api/budgets/${budgetId}`,{
        method: 'DELETE'
    });
    if(res.ok){
        dispatch(deleteBudget(budgetId))
    }
}

const initialState = {
    allBudgets: {},
    currentBudget: null,
}

const BudgetsReducer = (state = initialState, action) => {
    switch(action.type){
        case GET_BUDGETS:
            return {...state, allBudgets: action.payload};
        case GET_BUDGET:
            return {...state, currentBudget: action.payload};
        case CREATE_BUDGET:{
            return {
                ...state,
                allBudgets: {
                    ...state.allBudgets,
                    [action.payload.id]: action.payload
                }
            };
        }
        case EDIT_BUDGET:{
            return {
                ...state,
                allBudgets: {
                    ...state.allBudgets,
                    [action.payload.id]: action.payload
                }
            };
        }
        /*case CREATE_SUMMARY: {
            let newState = { ...state };
            newState.budgetSummary = action.payload;
            return newState;
        }*/
        case DELETE_BUDGET:{
            let newState = {...state};
            delete newState.allBudgets[action.payload];
            return newState;
        }
        default:
            return state;
    }
}

export default BudgetsReducer;