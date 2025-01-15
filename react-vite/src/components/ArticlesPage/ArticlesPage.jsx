import { csrfFetch } from "../../redux/csrf";
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import { useSelector, useDispatch } from 'react-redux';
import './ArticlesPage.css'
import LoginFormModal from '../LoginFormModal';
import { fetchBookmarks, createBookmark, removeBookmark } from '../../redux/bookmark';
import { FaBookmark, FaRegBookmark} from 'react-icons/fa';

const Articles = () => {
    const user = useSelector(state => state.session.user);
    const bookmarks = useSelector(state => state.bookmarks.bookmarks);
    const [articles, setArticles] = useState([]);
    const [localBookmarks, setLocalBookmarks] = useState([]);
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

    useEffect(() => {
        setLocalBookmarks(bookmarks.map(b => b.article_id));
    }, [bookmarks]);

    const toggleBookmark = async (article_id) => {
        if (!user) {
            setModalContent(<LoginFormModal />);
            return;
        }
        const isBookmarked = localBookmarks.includes(article_id);
        if (isBookmarked) {
            setLocalBookmarks(prev => prev.filter(id => id !== article_id));
            const currBookmark = bookmarks.find(bookmark => bookmark.article_id === article_id);
            if (currBookmark) {
                await dispatch(removeBookmark(article_id));
            }
        } else {
            setLocalBookmarks(prev => [...prev, article_id]);
            await dispatch(createBookmark(article_id));
        }
    };
 
    
    return user ? (
        <div className='resources-home'>
            <div className="top-section-article-page">
                <section className='resources-description animate__animated animate__slideInLeft'>
                    <div className='bookmarks-button-div'>
                        <NavLink to='/bookmarks'><button className='bookmarks-button'>My Bookmarks</button></NavLink>
                        <div className='bookmark-button-divider'></div>
                    </div>
                    <h2 className='feature-page-head'>Resources</h2>
                    <div className='feature-head-divider'></div>
                    <p className='feature-page-subhead'>Welcome to your Resoures Page, where you can educate yourself on financial opportunities and advice you may be missing.</p>
                    <p className='feature-page-subhead'>Unlike the tailored articles reccommended to you throughout this app, this section of articles are completely random allowing you to explore this hub at your own curiousity!</p>
                    <p className='feature-page-subhead beta'>Can't read it now? No problem! Add any Article to your Bookmarks and save for later!</p>
                </section>
            </div>
            <div className="bottom-section-article-page">
                <div className='resources-container-main-page'>
                    {articles.map((article) => (
                        <div key={article.id} className='article-card-main-page'>
                            <NavLink to={article.url} target='_blank'><p className='article-titles-main'>{article.title}</p></NavLink>
                            <button
                                className='bookmark-icon'
                                onClick={() => toggleBookmark(article.id)}
                            >
                                {localBookmarks.includes(article.id) ? <FaBookmark /> : <FaRegBookmark />}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    ) : setModalContent(<LoginFormModal />)
};
export default Articles;