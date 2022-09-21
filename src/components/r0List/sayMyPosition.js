import {useNodeBoundingPositionSize} from "@/hooks/useNodeBoundingPositionSize";
import {useEffect, useState} from "react";
import biui from "@/static/mp3/bi-ui-bi-ui.wav";
import cli from "@/static/mp3/cli.wav";
import cla from "@/static/mp3/cla.wav";
import useSound from "use-sound";
import listStyle from "./r0List.module.less";

const SayMyPosition = ({children, setCurrentCheckPosition, clickLight}) => {
    const [playBiui] = useSound(biui, {volume: 0.3});
    const [playCli] = useSound(cli, {volume: 0.5});
    const [playCla] = useSound(cla, {volume: 0.5});

    const [position, positionRef] = useNodeBoundingPositionSize();
    const [check, setCheck] = useState(false);
    const [click, setClick] = useState(false);
    const _clickLight = clickLight ? clickLight: false;
    useEffect(() => {
        if (position && check) {
            setCurrentCheckPosition(position);
        }
    }, [position, check]);
    const onMouseEnterHandler = () => {
        setCheck(true);
        playBiui();
    };
    const onMouseLeaveHandler = () => {
        setCheck(false);
    };
    const clickHandler = () => {
        if (click) {
            setClick(false);
            playCla();
        } else {
            setClick(true);
            playCli();
        }
    };
    return <div
        ref={positionRef}
        onMouseEnter={onMouseEnterHandler} onMouseLeave={onMouseLeaveHandler}
        onClick={_clickLight ? clickHandler: null}
        style={{
            position: "relative",
            boxSizing: "border-box",
            zIndex: 10,
        }}>
        <div style={{
            width: `${position.width / 20}px`,
            opacity: click ? 1: 0,
        }} className={listStyle.clickLeft}/>
        {children}
    </div>;
};
export default SayMyPosition;