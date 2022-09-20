import {useState, useRef, useEffect} from 'react';
// Follow: https://gist.github.com/morajabi/523d7a642d8c0a2f71fcfa0d8b3d2846
export const useNodeBoundingPositionSize = () => {
    const ref = useRef();
    const [rect, setRect] = useState({left: 0, top: 0});

    const set = () => setRect(ref && ref.current ? {
        left: ref.current.getBoundingClientRect().left,
        top: ref.current.getBoundingClientRect().top,
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight,
    } : {left: 0, top: 0, width: 0, height: 0});

    const useEffectInEvent = (event, useCapture) => {
        useEffect(() => {
            set();
            window.addEventListener(event, set, useCapture);
            return () => window.removeEventListener(event, set, useCapture);
        }, []);
    };
    useEffectInEvent("resize");
    useEffectInEvent("scroll", true);
    return [rect, ref];
};