import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookmarks} from '../../../redux/bookmark';
import './RelatedArticles.css';
import { NavLink } from 'react-router-dom';

const RelatedArticles = ({userData}) => {
    const user = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const allBookmarks = useSelector(state => state.bookmarks.bookmarks);
    const bookmarks = Object.values(allBookmarks);
    const [articles, setArticles] = useState([]);
    const [recArticles, setRecArticles] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const fetchArticles = async () => {
        const res = await csrfFetch('/api/articles');
        if (res.ok) {
            const data = await res.json();
            setArticles(data);
        }
    };
    useEffect(() => {
        if (user) {
            fetchArticles();
        }
    }, [user]);

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        setRecArticles(array.slice(0,4));
    };

    useEffect(() => {
        if(articles.length && userData){
            let recdArr;
            console.log(userData, "userData")
                //need to make case for -remainingBalance -difference
            if (userData.income) {
                if (userData.expenses) {
                    if (userData.income > userData.expenses) {
                        recdArr = articles.filter(article => article.level === 2)
                        setRecArticles(recdArr.slice(0,4))
                    }else if ((userData.income > userData.expenses) && ((userData.income * .75) < userData.expenses)){
                        recdArr = articles.filter(article => article.level === 1)
                        setRecArticles(recdArr.slice(0,4))
                    }else if(userData.income < userData.expenses){
                        recdArr = articles.filter(article => article.level = 0)
                        setRecArticles(recdArr.slice(0,4))
                    }
                } else{
                    recdArr = articles.filter(article => article.level === 0)
                    setRecArticles(recdArr.slice(0,4))
                    }
            }
            if (userData.remainingBalance) {

            }
            if (userData.difference) {

            }
            else {
                shuffleArray(articles);
            }
        };
        setIsLoaded(true);
    },[articles, userData]);

    


    return isLoaded && (
        <div className='resources-home'>
            <div className='resources-container'>
                {recArticles.map((article) => (
                    <div key={article.id} className=''>
                        <NavLink to={article.url} target="_blank"><h3 className='article-box-title'>{article.title}</h3></NavLink>
                    </div>
                ))}
            </div>
        </div>
    ) 
}

export default RelatedArticles;