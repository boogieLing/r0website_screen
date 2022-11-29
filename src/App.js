import {BrowserRouter, Route, Routes} from "react-router-dom";
import Test from "@/screens/Test";
import Home from "@/screens/Home";
import {observer} from "mobx-react-lite";
import CursorContextProvider from "@/components/cursor/cursorContextProvider";
import Cursor from "@/components/cursor/cursor";
import appStyle from "./App.module.less";
import Blog from "@/screens/Blog";

function App() {
    // TODO 需要浏览器性能。。。。。
    // const [mouseTail, setMouseTail] = useLocalStorage("printMouseTail", false)
    // const [, setIsSafari] = useLocalStorage("isSafari", false)
    // useEffect(() => {
    //     if (isSafari || isMobile || isMobileSafari) {
    //         setMouseTail(false);
    //         setIsSafari(true);
    //     } else {
    //         setMouseTail(true);
    //         setIsSafari(false);
    //     }
    // }, []);
    // // <Cursor/> 一定要在较高的层级，保证先渲染
    // const canvasSize = useWindowSize();
    return <CursorContextProvider>
        <Cursor/>
        <BrowserRouter>
            <div className={appStyle.App}>
                {/*<canvas* TODO 需要浏览器性能。。。。。*/}
                {/*    width={mouseTail ? canvasSize.width : 0} height={mouseTail ? canvasSize.height : 0}*/}
                {/*    className={appStyle.globalCanvas} id={globalStore.appCanvasId}*/}
                {/*/>*/}
                <Routes>
                    <Route exact strict path="/" element={<Home/>}/>
                    <Route exact strict path="/test" element={<Test/>}/>
                    <Route exact path="/blog" element={<Blog/>}/>
                    <Route exact path="/blog/:id" element={<Blog/>}/>
                    <Route exact path="/category/:categoryName" element={<Blog/>}/>
                    <Route exact path="/category/:categoryName/:id" element={<Blog/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    </CursorContextProvider>;
}

export default observer(App);