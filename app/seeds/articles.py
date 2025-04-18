from app.models import db, Article, environment, SCHEMA
from sqlalchemy.sql import text

def seed_articles():
    article_1 = Article(title='Life Hacks to Save Money',url='https://www.moneyfit.org/life-hacks-to-save-money/?gad_source=1&gclid=Cj0KCQiA0MG5BhD1ARIsAEcZtwQsIU3VMW8qc_VoMuX_m49v-pHs1T9MgUBRv1moo-YBSDYyW3AFofAaAvMFEALw_wcB',level=1)
    article_2 = Article(title='Building A Good Credit Score',url='https://www.td.com/us/en/personal-banking/finance/building-good-credit-score', level=1)
    article_3 = Article(title='Save Money on Food',url='https://www.incharge.org/financial-literacy/budgeting-saving/saving-money-at-the-grocery-store/',level=1)
    article_4 = Article(title='Ways to Save Money on a Tight Budget',url='https://www.bankrate.com/banking/savings/ways-to-save-money-on-a-tight-budget/',level=2)
    article_5 = Article(title='Five Ways to Help Maximize your Savings',url='https://www.onefamily.com/savings/five-ways-to-help-maximise-your-savings/',level=2)
    article_6 = Article(title='What Is a High-Yield Savings Account?',url='https://www.investopedia.com/articles/pf/09/high-yield-savings-account.asp',level=3)
    article_7 = Article(title='Are CDs Worth It?',url='https://www.investopedia.com/are-cds-worth-it-5223941',level=3)
    article_8 = Article(title='What Are Mutual Funds and How To Invest In Them',url='https://www.investopedia.com/terms/m/mutualfund.asp',level=3)
    article_9 = Article(title="How Is a Company's Share Price Determined With the Gordon Growth Model?",url='https://www.investopedia.com/ask/answers/061615/how-companys-share-price-determined.asp',level=9)
    article_10 = Article(title='What Happens When You Have a Maxed-Out Credit Card?',url='https://money.usnews.com/credit-cards/articles/what-is-a-maxed-out-credit-card',level=1)
    article_11 = Article(title='What Is a Debt Consolidation?',url="https://www.nerdwallet.com/article/loans/personal-loans/what-is-debt-consolidation",level=2)
    article_12 = Article(title='Prioritizing Debt By Interest Rate',url='https://www.equifax.com/personal/education/debt-management/articles/-/learn/prioritize-debt-payments/',level=2)
    article_13 = Article(title='How Cash Only Can Help You Save Money',url='https://believeinabudget.com/how-cash-only-spending-saves-money/',level=1)
    article_14 = Article(title='48 Side Hustle Ideas to Get You Started!',url='https://sidehustleschool.com/ideas/',level=4)
    article_15 = Article(title='Stock Market Basics for Beginners',url='https://www.bankrate.com/investing/stock-market-basics-for-beginners/',level=8)
    article_16 = Article(title='How to Start Investing',url='https://fortune.com/recommends/investing/how-to-start-investing/',level=8)
    article_17 = Article(title='What is a Roth IRA?',url='https://schwab.com/ira/roth-ira',level=5)
    article_18 = Article(title='What is Portfolio Diversification?',url='https://www.fidelity.com/learning-center/investment-products/mutual-funds/diversification',level=9)
    article_20 = Article(title='How to Get Out of Credit Card Debt',url='https://www.incharge.org/debt-relief/how-to-get-out-of-credit-card-debt/',level=2)
    article_21 = Article(title='Guide to Building an Emergency Fund',url='https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/',level=3)
    article_22 = Article(title='Pros and Cons of Freelance Work',url='https://www.flexjobs.com/blog/post/pros-and-cons-of-freelance-jobs/',level=4)
    article_23 = Article(title='When to Look for a New Job',url='https://www.nerdwallet.com/article/finance/is-a-new-job-the-right-financial-move',level=1)
    article_24 = Article(title='How to Ask for a Raise and Get It',url='https://www.roberthalf.com/us/en/insights/career-development/how-to-ask-for-raise-and-get-it',level=5)
    article_25 = Article(title='8 Ways to Get the Cheapest Car Insurance Rates Possible',url='https://www.nerdwallet.com/article/insurance/auto/ways-to-get-cheapest-car-insurance',level=8)
    article_26 = Article(title='Building Wealth for Recent Graduates',url='https://www.lanternnetwork.org/post/how-can-you-start-building-wealth-in-your-20s-a-saving-and-investing-guide-for-recent-graduates?gad_source=1&gclid=Cj0KCQiA0MG5BhD1ARIsAEcZtwQM5P-46_oh3cLXPP67vNnumGStVBGvgyery99eZAMqcsZ77l4p4icaAg4LEALw_wcB',level=0)
    article_27 = Article(title='Understanding Taxes',url='https://apps.irs.gov/app/understandingTaxes/student/index.jsp',level=0)
    article_28 = Article(title='Everything You Need to Know About Credit Counseling',url='https://www.incharge.org/debt-relief/credit-counseling/',level=0)

    db.session.add(article_1)
    db.session.add(article_2)
    db.session.add(article_3)
    db.session.add(article_4)
    db.session.add(article_5)
    db.session.add(article_6)
    db.session.add(article_7)
    db.session.add(article_8)
    db.session.add(article_9)
    db.session.add(article_10)
    db.session.add(article_11)
    db.session.add(article_12)
    db.session.add(article_13)
    db.session.add(article_14)
    db.session.add(article_15)
    db.session.add(article_16)
    db.session.add(article_17)
    db.session.add(article_18)
    db.session.add(article_20)
    db.session.add(article_21)
    db.session.add(article_22)
    db.session.add(article_23)
    db.session.add(article_24)
    db.session.add(article_25)
    db.session.add(article_26)
    db.session.add(article_27)
    db.session.add(article_28) 
    db.session.commit()
def undo_articles():
        if environment == "production":
            db.session.execute(f"TRUNCATE table {SCHEMA}.articles RESTART IDENTITY CASCADE;")
        else:
            db.session.execute(text("DELETE FROM articles"))
        
        db.session.commit()