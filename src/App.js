import {BrowserRouter, Route, Routes} from "react-router-dom";
import Test from "@/screens/Test";
import Home from "@/screens/Home";
import {observer} from "mobx-react-lite";
import CursorContextProvider from "@/components/cursor/cursorContextProvider";
import Cursor from "@/components/cursor/cursor";
import appStyle from "./App.module.less";
import Blog from "@/screens/Blog";
import {useEffect, useState} from "react";
import {isMobile, isMobileSafari, isSafari} from "react-device-detect";
import useLocalStorage from "@/hooks/localStorage";
import globalStore from "@/stores/globalStore";
import {useWindowSize} from "@/hooks/windowSize";
import {More} from "@/screens/More";
import {PicBed} from "@/screens/PicBed";
import {SomniumNexus} from "@/screens/SomniumNexus";
import UShouldKnow from "@/screens/UShouldKnow";
import TsugieIdea from "@/screens/TsugieIdea";

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
    // <Cursor/> 一定要在较高的层级，保证先渲染
    const canvasSize = useWindowSize();
    useEffect(() => {
        mySelf();
    }, []);
    return <CursorContextProvider>
        <BrowserRouter>
            <div className={appStyle.App }>
                {/* TODO 需要浏览器性能。。。。。*/}
                {/*<canvas*/}
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
                    <Route exact path="/more" element={<More/>}/>
                    <Route exact path="/colorful" element={<PicBed/>}/>
                    <Route exact path="/colorful/:categoryName" element={<PicBed/>}/>
                    <Route exact path="/somnium/nexus" element={<SomniumNexus/>}/>
                    <Route exact path="/ushouldknow" element={<UShouldKnow/>}/>
                    <Route exact path="/ushouldknow/:lang" element={<UShouldKnow/>}/>
                    <Route exact path="/idea/tsugie" element={<TsugieIdea/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    </CursorContextProvider>;
}

function mySelf() {
    /* 样式代码 */
    var styleTitle1 = `
font-size: 20px;
font-weight: 600;
color: rgb(244,167,89);
`
    var styleTitle2 = `
font-style: oblique;
font-size:14px;
color: rgb(244,167,89);
font-weight: 400;
`
    var styleContent = `
color: rgb(30,152,255);
`

    /* 内容代码 */
    var title1 = '🐱 R0 Website '
    var title2 = '天涯何处觅只因'

// => 读取配置型(在配置文件里配置这些会变动的网址)
    var offiUrl = 'www.shyr0.com'
    var content = `
版 本 号：2.1.0    
🚮官网: ${offiUrl}
📫电邮：ushouldknowr0@gmail.com
`
    console.log(`%c${title1} %c${title2}\n%c${content}`, styleTitle1, styleTitle2, styleContent);
    console.info(`
                                      ____    __               ____       __                                   
                                     /\\  _\`\\ /\\ \\             /\\  _\`\\   /'__\`\\                                 
 __  __  __  __  __  __  __  __  __  \\ \\,\\L\\_\\ \\ \\___   __  __\\ \\ \\L\\ \\/\\ \\/\\ \\      ___    ___     ___ ___    
/\\ \\/\\ \\/\\ \\/\\ \\/\\ \\/\\ \\/\\ \\/\\ \\/\\ \\  \\/_\\__ \\\\ \\  _ \`\\/\\ \\/\\ \\\\ \\ ,  /\\ \\ \\ \\ \\    /'___\\ / __\`\\ /' __\` __\`\\  
\\ \\ \\_/ \\_/ \\ \\ \\_/ \\_/ \\ \\ \\_/ \\_/ \\ __/\\ \\L\\ \\ \\ \\ \\ \\ \\ \\_\\ \\\\ \\ \\\\ \\\\ \\ \\_\\ \\__/\\ \\__//\\ \\L\\ \\/\\ \\/\\ \\/\\ \\ 
 \\ \\___x___/'\\ \\___x___/'\\ \\___x___/'/\\_\\ \`\\____\\ \\_\\ \\_\\/\`____ \\\\ \\_\\ \\_\\ \\____/\\_\\ \\____\\ \\____/\\ \\_\\ \\_\\ \\_\\
  \\/__//__/   \\/__//__/   \\/__//__/  \\/_/\\/_____/\\/_/\\/_/\`/___/> \\\\/_/\\/ /\\/___/\\/_/\\/____/\\/___/  \\/_/\\/_/\\/_/
                                                            /\\___/                                             
                                                            \\/__/                                                                                      
`);
}

export default observer(App);
