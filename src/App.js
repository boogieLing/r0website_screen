import {BrowserRouter, Route, Routes} from "react-router-dom";
import {isMobile, isMobileSafari, isSafari} from "react-device-detect";
// 导入页面组件
import Login from "./screens/Login";
import Home from "./screens/Home";
import {useEffect} from "react";
import osuStore from "@/stores/osuStore";
import globalStore from "@/stores/globalStore";
import {observer} from "mobx-react-lite";
import CursorContextProvider from "@/components/cursor/cursorContextProvider";
import Cursor from "@/components/cursor/cursor";
import {useWindowSize} from "@/hooks/windowSize";
import appStyle from "./App.module.less";
import useLocalStorage from "@/hooks/localStorage";

function App() {
    const [, setMouseTail] = useLocalStorage("printMouseTail", false)
    useEffect(() => {
        osuStore.getRandomBeatmap().then(_ => {
        });
        if (isSafari || isMobile || isMobileSafari) {
            console.log("qwq");
            setMouseTail(false);
        } else {
            console.log("qaq");
            setMouseTail(true);
        }

    }, []);
    //  <Cursor/> 一定要在较高的层级，保证先渲染
    const canvasSize = useWindowSize();
    return (<CursorContextProvider>
        <Cursor/>
        <BrowserRouter>
            <div className={appStyle.App}>
                <canvas
                    width={canvasSize.width} height={canvasSize.height}
                    className={appStyle.globalCanvas} id={globalStore.appCanvasId}/>
                <Routes>
                    < Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<Login>
                        <div>children</div>
                    </Login>}/>
                </Routes>
            </div>
        </BrowserRouter>
    </CursorContextProvider>);
}

export default observer(App);