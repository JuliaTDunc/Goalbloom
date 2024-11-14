import {useState, useEffect} from 'react';
import { TransGraphModal, TransListModal } from '../TransactionsModal';
import { useModal } from '../../context/Modal';
import { useSelector, useDispatch } from 'react-redux';
import NewTransactionFormModal from '../NewTransFormModal';
import './TransactionsPage.css'
import LoginFormModal from '../LoginFormModal';
import { fetchTransactions } from '../../redux/transaction';

const Transactions = () => {
    const user = useSelector(state => state.session.user);
    const [activeTab, setActiveTab] = useState('both');
    const {setModalContent} = useModal();
    const dispatch = useDispatch();

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    }
    const openNewTransactionModal = () => {
        setModalContent(<NewTransactionFormModal transaction={null}/>);
    }
    useEffect(() => {
        if (user) {
            dispatch(fetchTransactions())
        }
    },[dispatch, user])

    return user ? (
        <div className='transactions-home'>
            <section className='transactions-description'>
                <h2 className='transactions-page-head'>Your Transactions</h2>
                <p>Welcome to your Transactions Page, where you get to be the boss of your money!<br/>
                    To get started, just add your first transaction and see how your financial story unfolds. </p>
            </section>
            <div className='new-transaction'>
                <button className='new-trans-button' onClick={() => openNewTransactionModal()}>New Transaction</button>
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
    ) : setModalContent(<LoginFormModal/>)
};
export default Transactions;