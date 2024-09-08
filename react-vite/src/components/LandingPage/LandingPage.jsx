import React from 'react';
import Fleur from '../../images/fleur.png'
import './LandingPage.css'

function LandingPage() {

    return (
        <>
            <div className='background-container'>
            <div className='flower-image'><img src={Fleur} /></div>
            <p className='site-description'>Welcome to GoalBloom!
                Ready to get your finances on track? Say hello to GoalBloom, your new favorite budgeting tool, here to making money management easy and even a bit fun!
                Stay Updated
                Keep tabs on your spending, set savings goals, and see where your money goes!
                Learn as You Go
                Goalbloom has cool tips and articles to help you get smarter with your cash!
                Plan Ahead
                Select from your income, expenses, and goals, and GoalBloom will whip up budgeting plans to help you manage your money!</p>
            </div>
        </>
    )
}

export default LandingPage;