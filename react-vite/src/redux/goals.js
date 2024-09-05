

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
    const res = await fetch(`/api/goals/${id}`);
    if(res.ok){
        const data = await res.json();
        dispatch(getGoal(data));
        return data;
    }else{
        return null;
    }
}

export const fetchCreateGoal = (goal) => async (dispatch) => {
    console.log("GOOOOOOALLLLL::: ", goal)
    const res = await fetch('/api/goals', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(goal)
    });
    console.log("RES FROM GOAL.JS:", res)

    if (res.ok) {
        const data = await res.json();
        dispatch(createGoal(data));
        return data;
    } else {
        console.error('Failed to create goal:', res);
        return null;
    }
}

export const fetchEditGoal = (goal) => async (dispatch) => {
    const res = await fetch(`/api/goals/${goal.id}`, {
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
    const res = await fetch(`/api/goals/${goalId}`, {
        method: 'DELETE'
    })
    if(res.ok){
        dispatch(deleteGoal(goalId));
    }
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
            delete newState.allTransactions[action.payload];
            return newState;
        }
        default:
            return state;
    }
}

export default GoalsReducer;