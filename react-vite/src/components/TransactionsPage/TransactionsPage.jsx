import {useState, useEffect} from 'react';
import { TransGraphModal, TransListModal } from '../TransactionsModal';
import { useModal } from '../../context/Modal';
import { useSelector, useDispatch } from 'react-redux';
import NewTransactionFormModal from '../NewTransFormModal';
import RelatedArticles from '../ResourceLinks/RelatedArticles';
import './TransactionsPage.css'
import LoginFormModal from '../LoginFormModal';
import { fetchTransactions } from '../../redux/transaction';

const Transactions = () => {
    const user = useSelector(state => state.session.user);
    const allTransactions = useSelector(state => state.transactions.allTransactions);
    const transactions = Object.values(allTransactions);
    const [activeTab, setActiveTab] = useState('both');
    const {setModalContent} = useModal();
    const dispatch = useDispatch();
    let userData;

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

    if (transactions && transactions.length > 0) {
        const userDataInc = transactions
            .filter(transaction => !transaction.expense)
            .reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);
        const userDataExp = transactions
            .filter(transaction => transaction.expense)
            .reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);
        userData = {
            income: userDataInc,
            expenses: userDataExp
        };
    }


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
               { userData && <div className='related-articles'><RelatedArticles userData={userData}/></div> }
            </div>
        </div>
    ) : setModalContent(<LoginFormModal/>)
};
export default Transactions;