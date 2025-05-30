import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBudget, fetchDeleteBudget, fetchBudgets } from '../../../../redux/budget';
import { fetchBudgetItemsByBudget } from '../../../../redux/budgetItem';
import { csrfFetch } from '../../../../redux/csrf';
import { FaRegTrashAlt } from 'react-icons/fa';

const SavedBudgets =({ budgets, transactions, goals, updateCurrentBudget }) => {
    const dispatch = useDispatch();
    const [allBudgetItems, setAllBudgetItems] = useState([]);
    const [filteredBudgetData, setFilteredBudgetData] = useState([]);
    const [sortField, setSortField] = useState('name');
    const [filterText, setFilterText] = useState('');
    const [loading, setLoading] = useState(true);

   const updateChartBudget = (budget) => {
        dispatch(fetchBudget(budget.id))
        .then(()=>{
            updateCurrentBudget(budget);
        })
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        if (isNaN(date)) return 'Invalid Date';
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

     useEffect(() => {
        const fetchAllBudgetItems = async () => {
            setLoading(true);
            try {
            const promises = budgets.map(async (budget) => {
                const budgetItems = dispatch(fetchBudgetItemsByBudget(budget.id));
                return { budgetId: budget.id, items: budgetItems };
            });
            const results = await Promise.all(promises);
            const mergedBudgetItems = results.flatMap((result) => result.items);
            setAllBudgetItems(mergedBudgetItems);
            } catch (error) {
            } finally {
            setLoading(false);
            }
        };
    
        if (budgets.length > 0) {
        fetchAllBudgetItems();
        }
    }, [budgets, dispatch]);

    useEffect(() => {
        const fetchAndMapBudgets = async () => {
            if (loading || budgets.length === 0 || transactions.length === 0) return;

            try {
                const mappedData = await Promise.all(
                    budgets.map(async (budget) => {
                        try {
                            const res = await csrfFetch(`/api/budgets/${budget.id}/items`);
                            if (!res.ok) {
                                throw new Error(`Failed to fetch budget items for budget ${budget.id}`);
                            }
                            const data = await res.json();
                            const budgetItems = data.budgetItems || [];

                            console.log(`Budget ${budget.id} items:`, budgetItems);

                            const transactionItems = budgetItems.filter(item => item.transaction);
                            const totalExpenseAmount = transactions
                                .filter(transaction =>
                                    transactionItems.some(item => item.item_id === transaction.id && transaction.expense)
                                )
                                .reduce((acc, transaction) => acc + (transaction.amount || 0), 0);

                            return {
                                ...budget,
                                totalSpent: totalExpenseAmount,
                                remainingBalance: budget.total_amount - totalExpenseAmount,
                            };
                        } catch (error) {
                            console.error(`Error fetching budget items for budget ${budget.id}:`, error);
                            return {
                                ...budget,
                                totalSpent: 0,
                                remainingBalance: budget.total_amount,
                            };
                        }
                    })
                );

                setFilteredBudgetData(mappedData);
            } catch (error) {
                console.error("Error fetching and mapping budgets:", error);
            }
        };

        fetchAndMapBudgets();
    }, [loading, budgets, transactions]);


   const sortedBudgets = [...filteredBudgetData].sort((a, b) => {
        if (a[sortField] < b[sortField]) return -1;
        if (a[sortField] > b[sortField]) return 1;
        return 0;
    });

    const filteredBudgets = sortedBudgets.filter((budget) =>
        budget.name.toLowerCase().includes(filterText.toLowerCase())
    );
   
    const handleDelete = (budgetId) => {
        setLoading(true);
        dispatch(fetchDeleteBudget(budgetId))
            .then(() => {
                dispatch(fetchBudgets());
                updateCurrentBudget(null);
            })
            .catch((error) => {
                console.error("Failed to delete budget:", error);
            })
            .finally(() => setLoading(false));
    };
        
    if (loading) {
        return <div>Loading budgets...</div>;
    }
    return filteredBudgets && (
        <div>
            <div className="controls">
                <input
                    type="text"
                    placeholder="Filter by name"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                />
                <select
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value)}
                >
                    <option value="name">Name</option>
                    <option value="allocated">Allocated</option>
                    <option value="spent">Spent</option>
                    <option value="Remaining">Remaining</option>
                    <option value="date">Date</option>
                </select>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Allocated</th>
                        <th>Spent</th>
                        <th>Remaining</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBudgets.map((budget) => (
                        <tr key={budget.id}>
                            <td><button onClick={() => updateChartBudget(budget)} className='saved-budgets-colName'>{budget.name}</button></td>
                            <td>{budget.total_amount}</td>
                            <td>{budget.totalSpent}</td>
                            <td>{budget.remainingBalance}</td>
                            <td>{formatDate(budget.start_date)}</td>
                            <td className='saved-table-delete-button'>
                                <button className='delete-btn-budget' onClick={() => handleDelete(budget.id)}><FaRegTrashAlt /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SavedBudgets;
