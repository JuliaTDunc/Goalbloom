import { csrfFetch } from "../../redux/csrf";
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import { useSelector, useDispatch } from 'react-redux';
import './ArticlesPage.css'
import LoginFormModal from '../LoginFormModal';
import { fetchBookmarks, createBookmark, removeBookmark } from '../../redux/bookmark';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';

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
                <section className='resources-description'>
                    <div className='bookmarks-button-div'>
                        <NavLink to='/bookmarks'><button className='bookmarks-button'>My Bookmarks</button></NavLink>
                    </div>
                    <h2 className='resources-page-head'>Resources</h2>
                    <p>Welcome to your Resources Page, where you can expand your knowledge!<br />
                        Browse through a variety of helpful tools and articles, and bookmark the articles you want to revisit later. </p>
                </section>
            </div>
            <div className="bottom-section-article-page">
                <div className='resources-container-main-page'>
                    {articles.map((article) => (
                        <div key={article.id} className='article-card-main-page'>
                            <NavLink to={article.url} target='_blank'><h2 className='article-titles-main'>{article.title}</h2></NavLink>
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