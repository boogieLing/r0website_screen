import {BrowserRouter, Route, Routes} from 'react-router-dom'
// 导入页面组件
import Login from './screens/Login'
import Home from "./screens/Home";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<Login><div>children</div></Login>}/>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
