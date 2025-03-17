import { csrfFetch } from "../../redux/csrf";
import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import { useSelector, useDispatch } from 'react-redux';
import cardPlaceholder from '../../images/card-placeholder-img.png';
import CapOneCard from '../../images/CapOneCard.png';
import ChimeCard from '../../images/ChimeCard.png';
import ChaseFreedomCard from '../../images/ChaseFreedomCard.png';
import './ArticlesPage.css'
import LoginFormModal from '../LoginFormModal';
import { fetchBookmarks, createBookmark, removeBookmark } from '../../redux/bookmark';
import { FaBookmark, FaRegBookmark} from 'react-icons/fa';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Articles = () => {
    const user = useSelector(state => state.session.user);
    const bookmarks = useSelector(state => state.bookmarks.bookmarks);
    const [articles, setArticles] = useState([]);
    const [localBookmarks, setLocalBookmarks] = useState([]);
    const { setModalContent } = useModal();
    const dispatch = useDispatch();
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 400;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    }
    
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
                        <button className='bookmarks-button'><NavLink to='/bookmarks'>My Bookmarks</NavLink></button>
                        <div className='bookmark-button-divider'></div>
                    </div>
                    <h2 className='feature-page-head'>Resources</h2>
                    <div className='feature-head-divider'></div>
                    <p className='feature-page-subhead'>Welcome to your Resources Page, where you can educate yourself on financial opportunities and advice you may be missing.</p>
                </section>
            </div>
            <div className="credit-card-recommendations">
                <h3>Recommended Credit Cards</h3>
                <p>Looking for the best credit card for budgeting? Here are some great options!</p>
                    <div className="cards-div">
                    <div className="credit-card-div Best-Cashback-Card"><a href="https://www.capitalone.com/credit-cards/preapprove/lp/sem/build/build-2/?external_id=WWW_LPT136B_ZZZ_ONL-SE_ZZZZZ_T_SEM2_ZZZZ_c_Zg__kenshoo_clickid__686601427835_771344&target_id=kwd-133024381&oC=CO5w44SUmn&gad_source=1&gclid=Cj0KCQjw7dm-BhCoARIsALFk4v9cUUjHUgodDcjeKApKqMJmlAAflSC5VxrzYjlhST1v280mLb1KWWoaAtGdEALw_wcB" target="_blank" rel="noreferrer"><img src={CapOneCard} /></a></div>
                    <div className="credit-card-div Low-Interest-Rate-Card"><a href="https://www.chime.com/apply-credit-g/?cadid=12651590587_118936675414_613408119345&gad_source=1&gclid=Cj0KCQjw7dm-BhCoARIsALFk4v-P8xwj8SQKjtBknawkiHoSS1Ly6zlBxMB79cIfNMJmD7_KdasPmSoaAphhEALw_wcB&keyword=chime%20credit%20card&utm_source=google_ads" target="_blank" rel="noreferrer"><img src={ChimeCard} /></a></div>
                    <div className="credit-card-div Best-Travel-Rewards-Card"><a href="https://creditcards.chase.com/a1/freedom-unlimited/affiliates2023?CELL=6H8X&AFFID=SWlnSnn6x54-eiNUZko4iYWiiwAXqtwYxw&pvid=f0fd786cead54d0fa30db87745671983&jp_cmp=cc/1732009/aff/15-31763/na" target="_blank" rel="noreferrer"><img src={ChaseFreedomCard} /></a></div>
                    </div>
            </div>

            <div className="bottom-section-article-page">
                <div className='content-wrapper'>
                    <div className='resources-container-main-page'>
                        {articles.map((article) => (
                            <div key={article.id} className='article-card-main-page'>
                                <NavLink to={article.url} target='_blank'>
                                    <p className='article-titles-main'>{article.title}</p>
                                </NavLink>
                                <button
                                    className='bookmark-icon'
                                    onClick={() => toggleBookmark(article.id)}
                                >
                                    {localBookmarks.includes(article.id) ? <FaBookmark /> : <FaRegBookmark />}
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="extra-resources">
                        <h3>Financial Videos & Podcasts</h3>
                        <p>Explore budgeting videos and financial podcasts to enhance your knowledge.</p>

                        <div className="carousel-container">
                            {/* Left Arrow */}
                            <button className="scroll-btn left" onClick={() => scroll("left")}>
                                <FaChevronLeft size={25} />
                            </button>

                            <div className="video-scroll-container" ref={scrollRef}>
                                <div className="video-wrapper">
                                    <iframe
                                        src="https://www.youtube.com/embed/JP__utZQLb8?si=cjDBia0QztPtlqTy"
                                        title="Best Budgeting Hacks"
                                        allowFullScreen>
                                    </iframe>
                                </div>
                                <div className="video-wrapper">
                                    <iframe
                                        src="https://www.youtube.com/embed/37inkhgXnDg?si=Els8UkmO5x0tr5P2"
                                        title="How to Save More Money"
                                        allowFullScreen>
                                    </iframe>
                                </div>
                                <div className="video-wrapper">
                                    <iframe
                                        src="https://www.youtube.com/embed/IRi5Z7pp1K4?si=x-O5RFS33VXAnkaz"
                                        title="Top Financial Podcasts"
                                        allowFullScreen>
                                    </iframe>
                                </div>
                                <div className="video-wrapper">
                                    <iframe
                                        src="https://www.youtube.com/embed/TPS22HRRY1k?si=SqQJssJrnbzMD4MO"
                                        title="Investing for Beginners"
                                        allowFullScreen>
                                    </iframe>
                                </div>
                            </div>

                            {/* Right Arrow */}
                            <button className="scroll-btn right" onClick={() => scroll("right")}>
                                <FaChevronRight size={25} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : setModalContent(<LoginFormModal />)
};
export default Articles;