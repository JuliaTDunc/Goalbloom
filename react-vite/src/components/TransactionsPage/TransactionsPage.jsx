import {useState} from 'react';
import { TransGraphModal, TransListModal } from '../TransactionsModal';

const Transactions = () => {
    const [activeTab, setActiveTab] = useState('both');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    }
    return (
        <div className='transactions-home'>
            <div className='new-transaction'></div>
            <button>New Transaction</button>
            <div className='transactions-container'>
                <div className='tabs'>
                    <button onClick={() => handleTabChange('income')} className={activeTab === 'income' ? 'active' : ''}>Income</button>
                    <button onClick={() => handleTabChange('expense')} className={activeTab === 'expense' ? 'active' : ''}>Expense</button>
                    <button onClick={() => handleTabChange('both')} className={activeTab === 'both' ? 'active' : ''}>Both</button>
                </div>
                <div>
                    <TransGraphModal activeTab={activeTab} />
                    <TransListModal activeTab={activeTab} />
                </div>
            </div>
        </div>
        
    )
};
export default Transactions;