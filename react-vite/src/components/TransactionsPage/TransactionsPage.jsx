import React, {useState} from 'react';
import TransGraphModal from './TransGraphModal';
import TransListModal from './TransListModal';

const Transactions = () => {
    const [activeTab, setActiveTab] = useState('both');
    const [showGraphMdal, setShowGraphModal] = useState(false);
    const [showListModal, setShowListModal] = useState(false);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    }


    return (
        <div className='transactions-container'>
            <div className='tabs'>
                <button onClick={() => handleTabChange('income')} className={activeTab === 'income' ? 'active' : ''}>Income</button>
                <button onClick={() => handleTabChange('expense')} className={activeTab === 'expense' ? 'active' : ''}>Expense</button>
                <button onClick={() => handleTabChange('both')} className={activeTab === 'both' ? 'active' : ''}>Both</button>
            </div>
            <div className='actions'>
                <button onClick={() => setShowGraphModal(true)}>View Graph</button>
                <button onClick={() => setShowListModal(true)}>View List</button>
            </div>
            {showGraphModal && <TransGraphModal activeTab={activeTab} closeModal={() => setShowGraphModal(false)} />}
            {showListModal && <TransListModal activeTab={activeTab} closeModal={() => setShowListModal(false)} />}
        </div>
    )
};

export default Transactions;