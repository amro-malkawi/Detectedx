/**
 * Pricing Component
 */
import React from 'react';
import {Button} from 'reactstrap';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import IntlMessages from "Util/IntlMessages";

const PlanItem = ({planType, type, description, price, currency, planSubscribed, disabled, planCredit, features, color, onClick}) => (
    <RctCollapsibleCard customClasses="text-center plan-item" colClasses="col-md-4">
        <div className="pricing-icon mb-40">
            <img src={require('Assets/img/pricing-icon.png')} alt="pricing icon" className="img-fluid" width="" height=""/>
        </div>
        <h2 className={`text-${color} pricing-title`}>{type}</h2>
        <p>{description}</p>
        {planType !== 'free' && <span className="text-muted mb-5 d-block small">Starting at just</span>}
        <div className="mb-10">
            {planType === 'free' ?
                <h2 className="amount-title">price</h2>
                : <h2 className="amount-title">{price} {currency}<sub>/<IntlMessages id={'test.purchase.year'}/></sub></h2>
            }
            <span className="plan-credit">For {planCredit} <IntlMessages id={'test.purchase.points'}/></span>
        </div>
        <Button color={color} className='btn-block btn-lg mb-20 price-button' onClick={onClick} disabled={disabled}>
            {planSubscribed ? <IntlMessages id={'test.purchase.subscribed'}/> : <IntlMessages id={'test.purchase.select'}/>}
        </Button>
        <ul className="price-detail list-unstyled">
            {features.map((feature, key) => (
                <li key={key}>{feature}</li>
            ))}
        </ul>
    </RctCollapsibleCard>
);

export default PlanItem;
