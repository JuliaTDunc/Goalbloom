import { csrfFetch } from './csrf'

const GET_GOALS = 'goals/getAll';

const getGoals = (goals) => ({
    type: GET_GOALS,
    payload: goals
});

const toDict = async (goals) => {
    let orderedData = {};
    goals.forEach(goal => {
        orderedData[goal.id] = goal
    });
    return orderedData;
}

export const fetchGoals = () => async (dispatch) => {
    const res = await csrfFetch('/api/goals');
    if (res.ok) {
        const data = await res.json();
        const orderedData = await toDict(data);
        dispatch(getGoals(orderedData));
        return res;
    } else {
        console.error('Failed to fetch goals:', res);
        return null;
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
        default:
            return state;
    }
}

export default GoalsReducer;