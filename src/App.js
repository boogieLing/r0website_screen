import {BrowserRouter, Route, Routes} from "react-router-dom";
// 导入页面组件
import Login from "./screens/Login";
import Home from "./screens/Home";
import {useEffect, useState} from "react";
import osuStore from "@/stores/osuStore";
import globalStore from "@/stores/globalStore";
import {observer} from "mobx-react-lite";
import CursorContextProvider from "@/components/cursor/cursorContextProvider";
import Cursor from "@/components/cursor/cursor";
import appStyle from "./App.module.less";
import useNodeBoundingRect from "@/hooks/useNodeBoundingRect";
import {useWindowSize} from "@/hooks/windowSize";

function App() {
    useEffect(() => {
        osuStore.getRandomBeatmap().then(_ => {
        });
    }, []);
    //  <Cursor/> 一定要在较高的层级，保证先渲染
    const canvasSize = useWindowSize();
    return (
        <CursorContextProvider>
            <Cursor/>
            <BrowserRouter>
                <div className={appStyle.App}>
                    <canvas
                        width={canvasSize.width} height={canvasSize.height}
                        className={appStyle.globalCanvas} id={globalStore.appCanvasId}/>
                    <Routes>
                        < Route path="/" element={<Home/>}/>
                        <Route path="/login" element={
                            <Login>
                                <div>children</div>
                            </Login>
                        }/>
                    </Routes>
                </div>
            </BrowserRouter>
        </CursorContextProvider>
    );
}

export default observer(App);