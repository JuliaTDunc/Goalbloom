import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import TransactionsReducer from "./transaction";
import GoalsReducer from "./goals";
import BudgetsReducer from "./budget";
import budgetItemReducer from "./budgetItem";
import bookmarkReducer from "./bookmark";

const rootReducer = combineReducers({
  session: sessionReducer,
  transactions: TransactionsReducer,
  goals: GoalsReducer,
  budgets: BudgetsReducer,
  budgetItems: budgetItemReducer,
  bookmarks: bookmarkReducer,
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
