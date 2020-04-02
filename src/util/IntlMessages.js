/**
 * Language Provider Helper Component
 * Used to Display Localised Strings
 */
import React from 'react';
import {FormattedMessage, injectIntl, useIntl} from 'react-intl';

// Injected message
const InjectMessage = props => <FormattedMessage {...props} />;

export default injectIntl(InjectMessage, {
    withRef: false
});

export const IntlStringMessage = id => useIntl().formatMessage({id});