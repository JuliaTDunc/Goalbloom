import { csrfFetch } from "./csrf";

const SET_BUDGET_ITEMS = 'budgetItems/SET_BUDGET_ITEMS';

export const setBudgetItems = (budgetItems) => ({
    type: SET_BUDGET_ITEMS,
    payload: budgetItems,
});

export const fetchBudgetItemsByBudget = (budgetId) => async (dispatch) => {
    const res = await csrfFetch(`/api/budgets/${budgetId}/items`)
    if(!res.ok){
        throw new Error('Failed to fetch budget items')
    }
    const data = await res.json();
    dispatch(setBudgetItems(data.budgetItems));
}

const initialState = {
    budgetItems: []
};

const budgetItemsReducer = (state = initialState, action) => {
    switch(action.type){
        case SET_BUDGET_ITEMS:
            return{...state, budgetItems:action.payload}
        default: return state;
    }
}
export default budgetItemsReducer;
