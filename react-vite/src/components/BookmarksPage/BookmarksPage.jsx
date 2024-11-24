import { csrfFetch } from "../../redux/csrf";
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBookmarks, createBookmark, removeBookmark } from '../../redux/bookmark';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';

const Bookmarks = () => {
    const user = useSelector(state => state.session.user);
    const bookmarks = useSelector((state) => state.bookmarks.bookmarks);
    const [bookedArticles, setBookedArticles] = useState([]);
    const [localBookmarks, setLocalBookmarks] = useState([]);
    const dispatch = useDispatch();


    
    useEffect(() => {
        if (user) {
            dispatch(fetchBookmarks());
        }
    }, [dispatch, user]);

    useEffect(() => {
        setLocalBookmarks(bookmarks.map(b => b.article_id));
        const fetchBookmarkedArticles = async () => {
            const articlePromises = bookmarks.map(async (bookmark) => {
                const res = await fetch(`/api/articles/${bookmark.article_id}`);
                if (res.ok) {
                    return res.json();
                } else {
                    console.error(`Failed to fetch article with ID ${bookmark.article_id}`);
                    return null;
                }
            });

            const articles = await Promise.all(articlePromises);
            setBookedArticles(articles.filter(article => article));
        };

        if (bookmarks.length) {
            fetchBookmarkedArticles();
        }
    }, [bookmarks]);

    const toggleBookmark = async (article_id) => {
        console.log('TOGGLED', article_id)
        const isBookmarked = bookmarks.some((bookmark) => bookmark.article_id === article_id);
        console.log('isBOOKMARKED???', isBookmarked)
        if (isBookmarked) {
            console.log(`Removing bookmark for article ${article_id}`);
            const currBookmark = bookmarks.find((bookmark) => bookmark.article_id === article_id);
            if (currBookmark) {
                await dispatch(removeBookmark(article_id));
            }
        } else {
            await dispatch(createBookmark(article_id));
        }
    };
 
    
    return (
        <div className="resources-home">
            <section className="resources-description">
                <h2 className="resources-page-head">Resources</h2>
                <p>Your Bookmarked Articles</p>
            </section>
            <div className="resources-container-bookmark-page">
            {bookedArticles.map((article) => (
                <div key={article.id} className="article-card-main-page">
                    <NavLink to={article.url} target="_blank">
                        <h2 className="article-titles-main">{article.title}</h2>
                    </NavLink>
                    <button
                        className="bookmark-icon"
                        onClick={() => toggleBookmark(article.id)}
                    >
                        {bookmarks.some((b) => b.article_id === article.id) ? (
                            <FaBookmark />
                        ) : (
                            <FaRegBookmark />
                        )}
                    </button>
                </div>
            ))}
        </div>
    </div>
)
}

export default Bookmarks;