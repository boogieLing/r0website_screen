import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);

// 延迟初始化控制台指令系统（仅在开发环境）
// 完全静默模式，不输出任何信息
if (process.env.NODE_ENV === 'development') {
    setTimeout(() => {
        import('./utils/consoleCommandsSimple').then(module => {
            module.initConsoleCommands();
        }).catch(() => {
            // 完全静默处理错误，不输出任何信息
        });
    }, 1000);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
