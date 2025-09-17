import S from "./index.module.less";
import {memo, useCallback, useEffect, useRef, useState} from "react";

export const Win10GridBox = memo(({}) => {
    const mainRef = useRef();
    const [coords, setCoords] = useState({x: 0, y: 0});
    const [gridOffset, setGridOffset] = useState({x: 0, y: 0});
    const handleMainMouseMove = useCallback((event) => {
        setCoords({
            x: event.clientX - Math.floor(mainRef.current.getBoundingClientRect().left),
            y: event.clientY - Math.floor(mainRef.current.getBoundingClientRect().top),
        });
    }, [gridOffset]);
    
    return <div className={S.win10GridBox} >
        <div className={S.mainBox} onMouseMove={handleMainMouseMove} ref={mainRef}>{coords.x},{coords.y}</div>
    </div>
});