import {useState} from 'react';
import { TransGraphModal, TransListModal } from '../TransactionsModal';
import { useModal } from '../../context/Modal';
import { useSelector } from 'react-redux';
import NewTransactionFormModal from '../NewTransFormModal';
import './TransactionsPage.css'
import LoginFormModal from '../LoginFormModal';

const Transactions = () => {
    const user = useSelector(state => state.session.user);
    const [activeTab, setActiveTab] = useState('both');
    const {setModalContent} = useModal();

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    }
    const openNewTransactionModal = () => {
        setModalContent(<NewTransactionFormModal />);
    }

    if (!user){
        return setModalContent(<LoginFormModal />)
    }

    return (
        <div className='transactions-home'>
                <div className='transactions-header'>
                <div className='transactions-description'>
                    <p>Hey there! Welcome to your Transactions Page, where you get to be the boss of your money. This is the place where you can keep tabs on everything—whether it's cash coming in or money slipping out. Got a paycheck? Log it. Spent a bit too much on takeout? Log that too. You can easily add, edit, or even delete anything if your budget needs a little tweaking. And the best part? All those numbers turn into cool graphs that show you exactly where your money is going. No more guessing games—just a clear view of your financial life.

                        To get started, just add your first transaction and see how your financial story unfolds. You’ll be surprised how quickly you can get a handle on things. It’s all about taking small steps that lead to big results. So go ahead, start now, and take control of your money without breaking a sweat.</p>
                </div>
                    <div className='new-transaction'>
                        <button className='new-trans-button' onClick={() => openNewTransactionModal()}>New Transaction</button>
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
                <div className='helpful-resources'><p className='box-placeholder'>Helpful Resources</p></div>  
                <div className='related-articles'><p className='box-placeholder'>Related Articles</p></div> 
            </div>
        </div>
    )
};
export default Transactions;