/**
 * News Dashboard
 */

import React, { Component } from 'react'
import Content from './content';

export default class instruction extends Component {
    render() {
        return (
            <div className={'instruction-theme-white'} style={{position: 'absolute', height: '100%'}}>
                <Content/>
            </div>
        )
    }
}
