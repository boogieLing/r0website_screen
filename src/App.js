import {BrowserRouter, Route, Routes} from 'react-router-dom'
// 导入页面组件
import Login from './screens/Login';
import Home from "./screens/Home";
import {useEffect} from "react";
import osuStore from "@/stores/osuStore";
import {observer} from "mobx-react-lite";

function App() {
    useEffect(() => {
        osuStore.getRandomBeatmap().then(_ => {
        });
    }, [])
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={
                        <Login>
                            <div>children</div>
                        </Login>
                    }/>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default observer(App);