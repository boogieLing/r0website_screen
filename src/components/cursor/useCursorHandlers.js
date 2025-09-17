import {useContext, useCallback} from "react";
import {CursorContext} from "./cursorContextProvider";

const useCursorHandlers = (options = {}) => {
    const [, setCursor] = useContext(CursorContext);

    const toggleCursorActive = () => {
        setCursor(({active}) => ({
            active: !active
        }));
    };
    const toggleCursorDown = () => {
        setCursor(({down}) => ({
            down: !down
        }));
    };
    const onMouseEnter = useCallback(event => {
        if (options.onMouseEnter) {
            options.onMouseEnter(event);
        }
        toggleCursorActive();
    }, []);

    const onMouseLeave = useCallback(event => {
        if (options.onMouseLeave) {
            options.onMouseLeave(event);
        }
        toggleCursorActive();
    }, []);

    const onMouseDown = useCallback(event => {
        if (options.onMouseDown) {
            options.onMouseDown(event);
        }
        toggleCursorDown();
    }, []);

    const onMouseUp = useCallback(event => {
        if (options.onMouseUp) {
            options.onMouseUp(event);
        }
        toggleCursorDown();
    }, []);
    return {onMouseEnter, onMouseLeave, onMouseDown, onMouseUp};
};
export default useCursorHandlers;