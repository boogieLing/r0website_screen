import home from "./index.module.less";
import {useEffect, useState} from "react";

function PinkCookie({width, height, midOffset}) {
    const [ids, setId] = useState();
    let cookieDiameter = width / 3;
    if (width <= height+200) {
        // 如果是窄型屏幕
        cookieDiameter = height / 2.5;
    }
    const ringWidth = (cookieDiameter / 2) * 0.87;
    const percentageX = midOffset.x / (cookieDiameter / 2);
    const percentageY = midOffset.y / (cookieDiameter / 2);

    let offsetX = 0;
    let offsetY = 0;
    const threshold = 0.8;
    if (Math.abs(percentageX) > threshold) {
        offsetX = -(percentageX > 0 ? (percentageX - threshold): (percentageX + threshold)) * 17;
    }
    if (Math.abs(percentageY) > threshold) {
        offsetY = -(percentageY > 0 ? (percentageY - threshold): (percentageY + threshold)) * 17;
    }
    useEffect(() => {
        let id = "PinkCookie" + ("_" + Math.random()).replace(".", "_");
        setId(id);
    }, []);
    return (
        <div className={home.pinkCookie} style={{
            height: `${cookieDiameter}px`,
            width: `${cookieDiameter}px`,
            top: `${offsetY + (height - cookieDiameter) / 2}px`,
            left: `${offsetX + (width - cookieDiameter) / 2}px`,
        }} id={ids}>
            <div className={home.cookieDynamic}>
                <canvas width={cookieDiameter ? cookieDiameter - 20: 150}
                        height={cookieDiameter ? cookieDiameter - 20: 150} style={{
                    backgroundColor: "rgba(239, 109, 167, 1)"
                }}/>
                <div className={home.ringDynamic} style={{
                    mask: `radial-gradient(transparent ${ringWidth}px, #000 ${ringWidth}px)`,
                }}/>
                <div className={home.ringDynamicInsideShadow} style={{
                    width: `${ringWidth * 2}px`,
                    height: `${ringWidth * 2}px`,
                    boxShadow: "inset 0 0 20px 0 rgba(0, 0, 0, 0.7)"
                }}/>
            </div>

            <div className={home.ringFixed} style={{
                mask: `radial-gradient(transparent ${ringWidth}px, #000 ${ringWidth}px)`,
                width: `${cookieDiameter}px`,
                height: `${cookieDiameter}px`,
            }}/>

            <div className={home.ringDynamicFineLight}/>
        </div>
    );
}

export default PinkCookie;