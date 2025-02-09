import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBudget, fetchDeleteBudget, fetchBudgets } from '../../../redux/budget';
import { fetchBudgetItemsByBudget } from '../../../redux/budgetItem';
import { FaRegTrashAlt } from 'react-icons/fa';

const SavedBudgets =({ budgets, transactions, goals, updateCurrentBudget }) => {
    const dispatch = useDispatch();
    const budgetItemsState = useSelector(state => state.budgetItems || {});
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
                        // Extract budget items from the dispatch response
                        const response = await dispatch(fetchBudgetItemsByBudget(budget.id));
                        const budgetItems = response.payload; // Use payload instead of raw action

                        if (!budgetItems || budgetItems.length === 0) {
                            console.warn(`No budget items found for budget ${budget.id}`);
                            return {
                                ...budget,
                                totalSpent: 0,
                                remainingBalance: budget.total_amount,
                            };
                        }

                        const totalExpenseAmount = budgetItems
                            .filter(item => item.transaction)
                            .map(item => {
                                const matchingTransaction = transactions.find(transaction => transaction.id === item.item_id && transaction.expense);
                                return matchingTransaction ? matchingTransaction.amount : 0;
                            })
                            .reduce((sum, amount) => sum + amount, 0) || 0;

                        const totalSavedAmount = budgetItems
                            .filter(item => !item.transaction)
                            .map(item => {
                                const matchingGoal = goals.find(goal => goal.id === item.item_id);
                                return matchingGoal ? matchingGoal.saved_amount : 0;
                            })
                            .reduce((sum, savedAmount) => sum + savedAmount, 0) || 0;

                        const totalSpent = totalExpenseAmount + totalSavedAmount;
                        const remainingBalance = budget.total_amount - totalSpent;

                        console.log('Budget:', budget, 'Total Spent:', totalSpent, 'Remaining Balance:', remainingBalance);

                        return {
                            ...budget,
                            totalSpent,
                            remainingBalance,
                        };
                    })
                );

                setFilteredBudgetData(mappedData);
            } catch (error) {
                console.error("Error fetching budget data:", error);
            }
        };

        fetchAndMapBudgets();
    }, [loading, budgets, transactions, goals, dispatch]);


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
