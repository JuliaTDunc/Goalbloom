import CapOneCard from '../../../../images/CapOneCard.png';
import ChimeCard from '../../../../images/ChimeCardNew.png';
import ChaseFreedomCard from '../../../../images/ChaseFreedomCard.png'; 
import './CreditCards.css'

const CreditCards = () => {

    return(
        <div className ='recommended-credit-cards'>
            <h3>Recommended Credit Cards</h3>
            <p>Looking for the best credit card for budgeting? Here are some great options!</p>
            <div className="cards-div">
                <div className="credit-card-div"><p className='card-name-title'>Capital One</p><a href="https://www.capitalone.com/credit-cards/preapprove/lp/sem/build/build-2/?external_id=WWW_LPT136B_ZZZ_ONL-SE_ZZZZZ_T_SEM2_ZZZZ_c_Zg__kenshoo_clickid__686601427835_771344&target_id=kwd-133024381&oC=CO5w44SUmn&gad_source=1&gclid=Cj0KCQjw7dm-BhCoARIsALFk4v9cUUjHUgodDcjeKApKqMJmlAAflSC5VxrzYjlhST1v280mLb1KWWoaAtGdEALw_wcB" target="_blank" rel="noreferrer"><img src={CapOneCard} /></a></div>
                <div className="credit-card-div"><p className='card-name-title'>Chime Credit Builder</p><a href="https://www.chime.com/apply-credit-g/?cadid=12651590587_118936675414_613408119345&gad_source=1&gclid=Cj0KCQjw7dm-BhCoARIsALFk4v-P8xwj8SQKjtBknawkiHoSS1Ly6zlBxMB79cIfNMJmD7_KdasPmSoaAphhEALw_wcB&keyword=chime%20credit%20card&utm_source=google_ads" target="_blank" rel="noreferrer"><img src={ChimeCard} /></a></div>
                <div className="credit-card-div"><p className='card-name-title'>Chase Freedom Card</p><a href="https://creditcards.chase.com/a1/freedom-unlimited/affiliates2023?CELL=6H8X&AFFID=SWlnSnn6x54-eiNUZko4iYWiiwAXqtwYxw&pvid=f0fd786cead54d0fa30db87745671983&jp_cmp=cc/1732009/aff/15-31763/na" target="_blank" rel="noreferrer"><img src={ChaseFreedomCard} /></a></div>
            </div>
        </div>
    )
};

export default CreditCards;
