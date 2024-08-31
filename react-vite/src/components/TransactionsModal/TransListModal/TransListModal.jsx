import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions, fetchExpenseTypes, fetchEditTransaction, fetchDeleteTransaction } from '../../../redux/transaction';
import NewTransactionFormModal from '../../NewTransFormModal';

const TransListModal = ({activeTab}) => {
    const dispatch = useDispatch();
    const transactions = useSelector(state => Object.values(state.transactions.allTransactions));
    const expenseTypes = useSelector(state => state.transactions.expenseTypes);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editTransactionId, setEditTransactionId] = useState(null);

    useEffect(() => {
        dispatch(fetchTransactions());
        dispatch(fetchExpenseTypes());
    }, [dispatch]);

    useEffect(() => {
        if (transactions) {
            const filtered = transactions.filter(transaction => {
                if (activeTab === 'income' && !transaction.expense) return true;
                if (activeTab === 'expense' && transaction.expense) return true;
                if (activeTab === 'both') return true;
                return false;
            });
            if (JSON.stringify(filtered) !== JSON.stringify(filteredTransactions)) {
                setFilteredTransactions(filtered);
            }
        }
    }, [transactions, activeTab]);

    const handleEditClick = (transactionId) => {
        setEditTransactionId(transactionId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditTransaction(null);
    };

    const handleDelete = (transactionId) => {
        dispatch(fetchDeleteTransaction(transactionId))
            .then(() => {
                // Optionally, you can show a success message or reload the transactions
            })
            .catch((error) => {
                console.error('Failed to delete transaction:', error);
            });
    };
    

    if (!filteredTransactions.length) {
        return <p>No data for {activeTab}</p>;
    }
    return (
        <div className='modal-container'>
            <div className='modal-content'>
                <h2>{activeTab.charAt(0).toUpperCase()+ activeTab.slice(1)}List</h2>
                <div className='list-container'>
                    {filteredTransactions.map(transaction => (
                        <div key={transaction.id} className='transaction-item'>
                            <p>{transaction.name} - ${transaction.amount}</p>
                            {transaction.expense && (
                                <p>Expense Type: {transaction.expenseType ? transaction.expenseType.name : 'Unknown'}</p>
                            )}
                            <button onClick={() => handleEditClick(transaction.id)}>Edit</button>
                            <button onClick={() => handleDelete(transaction.id)}>Delete</button>
                        </div>
                    ))}
                </div>
            </div>
            {isModalOpen && (
                <NewTransactionFormModal
                transactionId={editTransactionId}
                onClose={handleCloseModal}
                />
            )}
        </div>
    )
};

export default TransListModal;