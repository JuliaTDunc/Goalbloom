import React from 'react';
import Fleur from '../../images/fleur.png'
import './LandingPage.css'

function LandingPage() {

    return (
        <>
            <div className='background-container'>
            <div className='flower-image'><img src={Fleur} /></div>
                <div className='site-description-container'>
                    <h2 className='site-description-welcome'>Welcome!</h2>
                    <p className='site-description'>Ready to get your finances on track? Say hello to GoalBloom, your new favorite budgeting tool, here to making money management easy and even a bit fun!</p>
                    <h5 className='site-description-header'>Stay Updated</h5>
                    <p className='site-description'> Keep tabs on your spending, set savings goals, and see where your money goes!</p>
                    <h5 className='site-description-header'>Learn as You Go</h5>
                    <p className='site-description'>Goalbloom has cool tips and articles to help you get smarter with your cash!</p>
                    <h5 className='site-description-header'>Plan Ahead</h5>
                    <p className='site-description'>Select from your income, expenses, and goals, and GoalBloom will whip up budgeting plans to help you manage your money!</p>
                </div>
            <div className='flower-image'><img src={Fleur} /></div>
            </div>
        </>
    )
}

export default LandingPage;