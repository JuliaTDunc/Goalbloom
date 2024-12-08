import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBudget, fetchSummary } from '../../redux/budget';
import { fetchBudgetItemsByBudget } from '../../redux/budgetItem';
import './BudgetSummary.css';


const BudgetSummary = (budgetDetails) => {
    const [summary, setSummary] = useState("");
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
    const currBudget = budgetDetails;

    console.log(currBudget, 'HEYYY')

    useEffect(() => {
        if (!summary) {
            let currSummary = dispatch(fetchSummary(currBudget))
                .then(setSummary(currSummary));
        }
    }, [summary, currBudget]);

    if (error) return <p>Error: {error}</p>;
    if (!summary) return <p>Loading summary...</p>;

    return (
        <div>
            <h2>{currBudget.name} Summary</h2>
            <p>{summary}</p>
        </div>
    );

}


export default BudgetSummary;