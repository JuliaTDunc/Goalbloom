import { csrfFetch } from "./csrf";

const SET_BOOKMARKS = 'bookmarks/SET_BOOKMARKS';
const ADD_BOOKMARK = 'bookmarks/ADD_BOOKMARK';
const DELETE_BOOKMARK = 'bookmarks/DELETE_BOOKMARK';


export const setBookmarks = (bookmarks) => ({
    type: SET_BOOKMARKS,
    payload: bookmarks,
});
export const addBookmark = (article_id) => ({
    type: ADD_BOOKMARK,
    payload: article_id,
});
export const deleteBookmark = (article_id) => ({
    type: DELETE_BOOKMARK,
    payload: article_id,
});


export const fetchBookmarks = () => async (dispatch) => {
    const res = await csrfFetch(`/api/bookmarks`);
    if (!res.ok) {
        throw new Error('Failed to fetch bookmarks');
    }
    const data = await res.json();
    dispatch(setBookmarks(data));
    return res;
};
export const createBookmark = (article_id) => async (dispatch) => {
    const res = await csrfFetch(`/api/bookmarks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article_id }),
    });
    if (!res.ok) {
        throw new Error('Failed to create bookmark');
    }
    const data = await res.json();
    dispatch(addBookmark(data));
    return res;
};
export const removeBookmark = (article_id) => async (dispatch) => {
    const res = await csrfFetch(`/api/bookmarks/${article_id}`, {
        method: 'DELETE',
    });
    if (!res.ok) {
        throw new Error('Failed to delete bookmark');
    }
    dispatch(deleteBookmark(article_id));
};

const initialState = {
    bookmarks: []
};
const bookmarkReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_BOOKMARKS:
            return { ...state, bookmarks: action.payload };
        case ADD_BOOKMARK:
            return { ...state, bookmarks: [...state.bookmarks, action.payload] };
        case DELETE_BOOKMARK:
            return {
                ...state,
                bookmarks: state.bookmarks.filter((id) => id !== action.payload),
            };
        default:
            return state;
    }
};

export default bookmarkReducer;
