import React, {createContext, useState} from "react";

export const CursorContext = createContext("");
const CursorContextProvider = (props) => {
    const [cursor, setCursor] = useState({active: false, down: false});

    return (
        <CursorContext.Provider value={[cursor, setCursor]}>
            {props.children}
        </CursorContext.Provider>
    );
};

export default CursorContextProvider;