import home from "./index.module.less";
import {memo, useEffect, useMemo, useState} from "react";

const DynamicBackground = memo(({width, height, midOffset, curImageUrl}) => {
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    useEffect(()=>{
        if (midOffset) {
            setOffsetY(-midOffset.y * 0.04);
            setOffsetX(-midOffset.x * 0.04);
        }
    }, [midOffset]);
    return <div className={home.backGroundImgBox}>
        <div className={home.backGroundImgMask}/>
        <img src={curImageUrl} className={home.backGroundImg}
             width={width * 1.1} height={height * 1.1} alt="" style={{
            transform: `translate(${offsetX}px,${offsetY}px)`
        }}/>
    </div>;
});

export default DynamicBackground;