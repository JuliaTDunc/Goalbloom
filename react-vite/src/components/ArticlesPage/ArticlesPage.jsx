import { csrfFetch } from "../../redux/csrf";
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import { useSelector, useDispatch } from 'react-redux';
import './ArticlesPage.css'
import LoginFormModal from '../LoginFormModal';
import { fetchBookmarks, createBookmark } from '../../redux/bookmark';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';

const Articles = () => {
    const user = useSelector(state => state.session.user);
    const bookmarks = useSelector(state => state.bookmarks.bookmarks);
    //const budgets = Object.values(allBookmarks);
    const [articles, setArticles] = useState([]);
    const { setModalContent } = useModal();
    const dispatch = useDispatch();
    
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };
    const fetchArticles = async () => {
        const res = await csrfFetch('/api/articles');
        if (res.ok) {
            const data = await res.json();
            const shuffledArticles = shuffleArray(data);
            setArticles(shuffledArticles);
        }
    };
    useEffect(() => {
        if (user) {
            dispatch(fetchBookmarks());
        }
        fetchArticles();
    }, [dispatch, user]);


    const toggleBookmark = async (article_id) => {
        console.log('TOGGLED', article_id)
        if (!user) {
            setModalContent(<LoginFormModal />);
            return;
        }
        const isBookmarked = bookmarks.includes(article_id);
        console.log('isBOOKMARKED???', isBookmarked)
        if (isBookmarked) {
            console.log(`Removing bookmark for article ${article_id}`);
        } else {
            dispatch(createBookmark(article_id));
        }
    };
 
    
    return user ? (
        <div className='resources-home'>
            <section className='resources-description'>
                <h2 className='resources-page-head'>Resources</h2>
                <p>Welcome to your Resources Page, where you can expand your knowledge!<br />
                    Browse through a variety of helpful tools and articles, and bookmark the articles you want to revisit later. </p>
            </section>
            <div className='bookmarks-button-div'>
                <NavLink to='/bookmarks'><button className='bookmarks-button'>My Bookmarks</button></NavLink>
            </div>
            <div className='resources-container'>
                {articles.map((article) => (
                    <div key={article.id} className='article-card'>
                        <h3>{article.title}</h3>
                        <button
                            className='bookmark-icon'
                            onClick={() => toggleBookmark(article.id)}
                        >
                            {bookmarks && bookmarks.includes(article.id) ? <FaBookmark/> : <FaRegBookmark/>}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    ) : setModalContent(<LoginFormModal />)
};
export default Articles;