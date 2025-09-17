import React, {Component} from 'react';
import {Scrollbars} from 'react-custom-scrollbars';
import curPostStore from "@/stores/curPostStore";


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

    handleUpdate = () => {
        const topHeight = 100;
        const h2List = document.querySelectorAll('h2');
        const totalHeight = document.documentElement.clientHeight || document.body.clientHeight;
        for (let h2Item of h2List) {
            const ans = h2Item.getBoundingClientRect().top;
            if (ans < totalHeight - 300 && ans > 50) {
                curPostStore.setCurTitle(h2Item.innerText);
                break; // 一个小优化
            }
        }
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
                onUpdate={this.handleUpdate}
                {...this.props}
            />
        );
    }
}
