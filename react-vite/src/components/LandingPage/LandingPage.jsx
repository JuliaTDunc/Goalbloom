import React from 'react';
import Fleur from '../../images/fleur.png'
import './LandingPage.css'

function LandingPage() {

    return (
        <>
            <div className="landing-page">
                <div className="welcome-section">
                    <img src={Fleur} alt="Welcome Fleur" className="fleur-image" />
                    <h1 className="welcome-heading">Welcome</h1>
                    <p className="welcome-text">
                        Ready to get your finances on track? Say hello to GoalBloom, your new favorite budgeting tool, here to make money management easy and even a bit fun!
                    </p>
                </div>
                <div className="features-section">
                    <h2 className="features-title">More Features Coming Soon...⚙️</h2>
                    <div className="feature-grid">
                        <div className="feature-item">
                            <h2>Stay Updated</h2>
                            <p>Keep tabs on your spending, set savings goals, and see where your money goes!</p>
                        </div>
                        <div className="feature-item">
                            <h2>Plan Ahead</h2>
                            <p>Goalbloom has cool tips and articles to help you get smarter with your cash!</p>
                        </div>
                        <div className="feature-item">
                            <h2>Learn As You Go</h2>
                            <p>Select from your income, expenses, and goals, and GoalBloom will whip up budgeting plans to help you manage your money!</p>
                        </div>
                        {/* You can add another feature item here if needed */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default LandingPage;