import home from "./index.module.less";

function DynamicBackground({width, height, midOffset, curImageUrl}) {
    const offsetX = -midOffset.x * 0.04;
    const offsetY = -midOffset.y * 0.04;
    return <div className={home.backGroundImgBox}>
        <div className={home.backGroundImgMask}/>
        <img src={curImageUrl} className={home.backGroundImg}
             width={width * 1.1} height={height * 1.1} alt="" style={{
            transform: `translate(${offsetX}px,${offsetY}px)`
        }}/>
    </div>;
}

export default DynamicBackground;