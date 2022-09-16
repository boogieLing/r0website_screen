import {BrowserRouter, Route, Routes} from 'react-router-dom'
// 导入页面组件
import Login from './screens/Login';
import Home from "./screens/Home";
import {useEffect} from "react";

function App() {
    useEffect(() => {
        fetch("https://osu.ppy.sh/api/get_beatmaps?k=a7c39007a3f6c4cebdee5900dcf355cd1b13fd74", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        }).then((response) => {
            console.log(response);
            return response.json();
        });
    })
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<Login>
                        <div>children</div>
                    </Login>}/>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
