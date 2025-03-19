import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchSummary } from '../../redux/budget';
import './BudgetSummary.css';


const BudgetSummary = (budgetDetails) => {
    const [summary, setSummary] = useState("");
    const dispatch = useDispatch();
    const error = useState(null);
    const currBudget = budgetDetails;

    useEffect(() => {
        if (!summary) {
            let currSummary = dispatch(fetchSummary(currBudget))
                .then(() => {
                    setSummary(currSummary);
                })
        }
    }, [summary, currBudget]);

    if (error) return <p>Error: {error}</p>;


    return summary ? (
        <div>
            <h2>{currBudget.name} Summary</h2>
            <p>{summary}</p>
        </div>
    ) : (
        <div>
        </div>
    );
}


export default BudgetSummary;