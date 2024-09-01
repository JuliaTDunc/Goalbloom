import {useState} from 'react';
import { TransGraphModal, TransListModal } from '../TransactionsModal';
import { useModal } from '../../context/Modal';
import NewTransactionFormModal from '../NewTransFormModal';
import './TransactionsPage.css'

const Transactions = () => {
    const [activeTab, setActiveTab] = useState('both');
    const {setModalContent} = useModal();

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    }
    const openNewTransactionModal = () => {
        setModalContent(<NewTransactionFormModal />);
    }
    return (
        <div className='transactions-home'>
            <div className='transactions-header'>
                <div className='transactions-description'>
                    <p>This is the transactions page! Track all income and expenses here!</p>
                </div>
                <div className='new-transaction'>
                    <button className='new-trans-button' onClick={openNewTransactionModal}>New Transaction</button>
                </div>
            </div>
            <div className='transactions-container'>
                <div className='graph-list-section'>
                    <div className='trans-list'>
                        <div className='tabs'>
                            <button onClick={() => handleTabChange('income')} className={activeTab === 'income' ? 'active' : ''}>Income</button>
                            <button onClick={() => handleTabChange('expense')} className={activeTab === 'expense' ? 'active' : ''}>Expense</button>
                            <button onClick={() => handleTabChange('both')} className={activeTab === 'both' ? 'active' : ''}>Both</button>
                        </div>
                        <TransListModal activeTab={activeTab} />
                    </div>
                    <div className='trans-graph'>
                        <TransGraphModal activeTab={activeTab} />
                    </div>
                </div>
                
                <div className='helpful-resources'></div>  
                <div className='related-articles'></div> 
                
            </div>
        </div>
        
    )
};
export default Transactions;