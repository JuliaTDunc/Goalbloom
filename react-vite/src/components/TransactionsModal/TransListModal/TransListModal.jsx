//import React from 'react';

const TransListModal = ({activeTab, closeModal}) => {
    return (
        <div className='modal-container'>
            <div className='modal-content'>
                <button onClick={closeModal} className='close-button'>Close</button>
                <h2>{activeTab.char(0).toUpperCase()+ activeTab.slice(1)}List</h2>
                {/*Google React Form Probably */}
                <div className='list-container'>
                    {activeTab === 'income' && <p className='list-title'>Income</p>}
                    {activeTab === 'expense' && <p className='list-title'>Expense</p>}
                    {activeTab === 'both' && <p className='list-title'>Compare</p>}
                </div>
            </div>
        </div>
    )
};

export default TransListModal;