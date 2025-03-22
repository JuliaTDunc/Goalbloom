import { csrfFetch } from "../../../redux/csrf";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaExternalLinkAlt} from "react-icons/fa";
import './RelatedArticles.css';
import { NavLink } from 'react-router-dom';

const RelatedArticles = ({userData}) => {
    const user = useSelector(state => state.session.user);
    const dispatch = useDispatch();
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
            //transactions
            if (userData.income && userData.expenses) {
                if (userData.income > userData.expenses) {
                    recdArr = articles.filter(article => article.level === 3)
                    setRecArticles(recdArr.slice(0,4))
                }else if (((userData.income * .75) < userData.expenses)){
                    recdArr = articles.filter(article => article.level === 2)
                    setRecArticles(recdArr.slice(0,4))
                }else if(userData.income < userData.expenses){
                    recdArr = articles.filter(article => article.level = 1)
                    setRecArticles(recdArr.slice(0,4))
                }
            }
            //budgets
            if (userData.remainingBalance && userData.totalIncome) {
                if(userData.remainingBalance < (userData.totalIncome * .10)){
                    recdArr = articles.filter(article => article.level === 7)
                    setRecArticles(recdArr.slice(0,4))
                }else if(userData.remainingBalance <= (userData.totalIncome * .33)){
                    recdArr = articles.filter(article => article.level === 8)
                    setRecArticles(recdArr)
                }else if(userData.remainingBalance >= (userData.totalIncome * .34)){
                    recdArr = articles.filter(article => article.level === 9)
                        setRecArticles(recdArr.slice(0,4))
                }
            }
            //goals
            if (userData.difference && userData.totalAmount) {
                if(userData.difference < (userData.totalAmount * .75)){
                    recdArr = articles.filter(article => article.level === 6)
                    setRecArticles(recdArr.slice(0,4))
                }else if(userData.difference > (userData.totalAmount * .45)){
                    recdArr = articles.filter(article => article.level === 5)
                    setRecArticles(recdArr.slice(0,4))
                }else if(userData.difference >= (userData.totalAmount * .46)){
                    recdArr = articles.filter(article => article.level === 4)
                    setRecArticles(recArticles.slice(0,4))
                }
            }
            else {
                shuffleArray(articles);
            }
        }
        setIsLoaded(true);
    },[articles, userData]);

    return isLoaded && (
        <div className='resources-links'>
            <div className='resources-links-container'>
                {recArticles.map((article) => (
                    <div key={article.id} className='single-article-resource-links'>
                        <NavLink to={article.url} target="_blank"><h3 className='article-box-title'>{article.title}<FaExternalLinkAlt className="external-link" /></h3></NavLink>
                        <div className="tldr">
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RelatedArticles;