//import React from 'react';

const TransGraphModal = ({activeTab, closeModal}) => {
    return (
        <div className='modal-container'>
            <div className='modal-content'>
                <button onClick={closeModal} className='close-button'>Close</button>
                <h2>{activeTab.char(0).toUpperCase() + activeTab.slice(1)}Graph</h2>
                {/* chart here, 'React Google' is cute. has pie and bar */}
                <div className='graph-container'>
                    {activeTab === 'income' && <p className='graph-title'>Income</p>}
                    {activeTab === 'expense' && <p className='graph-title'>Expense</p>}
                    {activeTab === 'both' && <p className='graph-title'>Compare</p>}
                </div>
            </div>
        </div>
    )
};

export default TransGraphModal;