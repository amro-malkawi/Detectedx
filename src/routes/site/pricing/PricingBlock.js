/**
 * Pricing Component
 */
import React from 'react';
import { Button } from 'reactstrap';

// component
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

// intl messages
import IntlMessages from 'Util/IntlMessages'

const PricingBlock = ({ planType, type, description, price, users, features, color, buttonText, onClick }) => (
   <RctCollapsibleCard customClasses="text-center" colClasses="col-md-4">
      <div className="pricing-icon mb-40">
         <img src={require('Assets/img/pricing-icon.png')} alt="pricing icon" className="img-fluid" width="" height="" />
      </div>
      <h2 className={`text-${color} pricing-title`}>{type}</h2>
      <p>{description}</p>
      {planType !== 'free' && <span className="text-muted mb-5 d-block small">Starting at just</span>}
      <div className="mb-10">
         {planType === 'free' ?
            <h2 className="amount-title">price</h2>
            : <h2 className="amount-title">${price}<sub>/year</sub></h2>
         }
         <span className="text-muted small">For {users} user</span>
      </div>
       <Button color={color} className='btn-block btn-lg mb-20' onClick={onClick}>
           {buttonText}
       </Button>
      <ul className="price-detail list-unstyled">
         {features.map((feature, key) => (
            <li key={key}>{feature}</li>
         ))}
      </ul>
   </RctCollapsibleCard>
);

export default PricingBlock;
