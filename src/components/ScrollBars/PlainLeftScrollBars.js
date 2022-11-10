import React, {Component} from 'react';
import {Scrollbars} from 'react-custom-scrollbars';


export default class PlainLeftScrollBars extends React.PureComponent {
    constructor(props) {
        super(props);
        this.renderTrackVertical = this.renderTrackVertical.bind(this);
        this.renderThumbVertical = this.renderThumbVertical.bind(this);
    }

    renderTrackVertical({style, ...props}) {
        const finalStyle = {
            ...style,
            left: 0,
            right: 'auto',
            bottom: 2,
            top: 2,
            borderRadius: 3,
        };
        return (
            <div style={finalStyle} {...props}/>
        );
    }

    renderThumbVertical({style, ...props}) {
        const finalStyle = {
            ...style,
            backgroundColor: "rgba(223, 230, 233,0.3)",
            borderRadius: "0 3px 3px 0"
        };
        return (
            <div style={finalStyle} {...props}/>
        );
    }

    render() {
        return (
            <Scrollbars
                autoHide
                // Hide delay in ms
                autoHideTimeout={1000}
                // Duration for hide animation in ms.
                autoHideDuration={200}
                renderTrackVertical={this.renderTrackVertical}
                renderThumbVertical={this.renderThumbVertical}
                {...this.props}
            />
        );
    }
}
