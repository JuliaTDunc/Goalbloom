import { csrfFetch } from "./csrf";

const GET_GOALS = 'goals/getAll';
const GET_GOAL = 'goals/getById';
const CREATE_GOAL = 'goals/create';
const EDIT_GOAL = 'goals/edit';
const DELETE_GOAL = 'goals/delete';

const getGoals = (goals) => ({
    type: GET_GOALS,
    payload: goals
});

const getGoal = (goal) => ({
    type: GET_GOAL,
    payload: goal
}) 

const createGoal = (goal) => ({
    type: CREATE_GOAL,
    payload: goal
})

const editGoal = (goal) => ({
    type: EDIT_GOAL,
    payload: goal
})

const deleteGoal = (goalId) => ({
    type: DELETE_GOAL,
    payload: goalId
})

export const fetchGoals = () => async (dispatch) => {
    const res = await fetch('/api/goals');
    if (res.ok) {
        const data = await res.json();
        dispatch(getGoals(data));
        return res;
    } else {
        console.error('Failed to fetch goals:', res);
        return null;
    }

}

export const fetchGoal = (id) => async (dispatch) => {
    const res = await csrfFetch(`/api/goals/${id}`);
    if(res.ok){
        const data = await res.json();
        await dispatch(getGoal(data));
        return data;
    }else{
        console.error('Failed to fetch goal :[')
        return null;
    }
}

export const fetchCreateGoal = (goal) => async (dispatch) => {
    const res = await csrfFetch('/api/goals', {
        method: 'POST',
        body: JSON.stringify(goal)
    });

        const newGoal = await res.json();
        dispatch(createGoal(newGoal));
        return newGoal;
}

export const fetchEditGoal = (goal) => async (dispatch) => {
    const res = await csrfFetch(`/api/goals/${goal.id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(goal)
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(editGoal(data));
        return data;
    } else {
        console.error('Failed to edit goal:', res);
        return null;
    }
}

export const fetchDeleteGoal = (goalId) => async (dispatch) => {
    const res = await csrfFetch(`/api/goals/${goalId}`, {
        method: 'DELETE'
    })
        dispatch(deleteGoal(goalId));
}
const initialState = {
    allGoals: {},
    currentGoal: null,
}

const GoalsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_GOALS:
            return { ...state, allGoals: action.payload };
        case GET_GOAL:
            return {...state, currentGoal: action.payload};
        case CREATE_GOAL: {
            let newState = {...state};
            newState.allGoals[action.payload.id] = action.payload;
            return newState;
        }
        case EDIT_GOAL:{
            let newState = {...state};
            newState.allGoals[action.payload.id] = action.payload;
            return newState;
        }
        case DELETE_GOAL: {
            let newState = {...state};
            delete newState.allGoals[action.payload];
            return newState;
        }
        default:
            return state;
    }
}

export default GoalsReducer;