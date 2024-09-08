import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions, fetchExpenseTypes, fetchDeleteTransaction, fetchTransaction } from '../../../redux/transaction';
import {FaRegTrashAlt, FaPencilAlt} from 'react-icons/fa'
import NewTransactionFormModal from '../../NewTransFormModal';
import { useModal } from '../../../context/Modal';
import './TransListModal.css'

const TransListModal = ({activeTab}) => {
    const dispatch = useDispatch();
    const transactions = useSelector(state => Object.values(state.transactions.allTransactions));
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const { setModalContent } = useModal();

    const openTransModal = (transactionId) => {
        const existingTrans = transactions.find(transaction => transaction.id === transactionId);
        if(existingTrans){
            dispatch(fetchTransaction(transactionId))
                .then(() => {
                     setModalContent(<NewTransactionFormModal />);
                })
        }
    }

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

    const handleDelete = (transactionId) => {
        dispatch(fetchDeleteTransaction(transactionId))
            .then(() => {
                dispatch(fetchTransactions());
            })
            .catch((error) => {
                console.error('Failed to delete transaction:', error);
            });
    };
    

    if (!filteredTransactions.length) {
        if(activeTab === 'income' || activeTab === 'expense'){
            return <p>No data for {activeTab}</p>;
        }else{
            return <p>Add income and expense data to track your cash! </p>
        }
    }
    return (
        <div className='modal-container'>
            <div className='modal-content'>
                {activeTab === 'income' || activeTab === 'expense' ? (
                    <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} List</h2>
                ): <h2>Compare</h2>}
                <div className='list-container'>
                    {filteredTransactions.map(transaction => (
                        <div key={transaction.id} className='transaction-item'>
                            <p>{transaction.name} - ${transaction.amount}</p>
                            {transaction.expense && (
                                <p>Expense Type: {transaction.expenseType ? transaction.expenseType.name : 'Unknown'}</p>
                            )}
                            <button className='trans-list-edit-button' onClick={() => openTransModal(transaction.id)}><FaPencilAlt /></button>
                            <button className='trans-list-delete-button' onClick={() => handleDelete(transaction.id)}><FaRegTrashAlt /></button>
                        </div> 
                    ))}
                </div>
            </div>
        </div>
    )
};

export default TransListModal;