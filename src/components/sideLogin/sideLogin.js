import sideLoginStyle from "./sideLogin.module.less";
import backIconImg from "./backIcon.png";
import useSound from "use-sound";
import buiu from "@/static/mp3/bu-iu.wav";
import bunnnnn from "@/static/mp3/bunnnnn.wav";
import {useEffect, useRef, useState} from "react";
import userStore from "@/stores/userStore";
import R0List from "@/components/r0List/r0List";
import OptionItem from "@/components/sideLogin/optionItem";
import ButtonItem from "@/components/sideLogin/buttonItem";
import InputItem from "@/components/sideLogin/inputItem";

const SideLogin = ({show, hiddenLoginHandle}) => {
    const [playBuiu] = useSound(buiu, {volume: 0.3});
    const [playBunnnnn] = useSound(bunnnnn, {volume: 0.3});
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [notice, setNotice] = useState({
        visible: false,
        message: ""
    });
    const noticeTimerRef = useRef(null);
    const closeTimerRef = useRef(null);
    const listLights = isRegisterMode
        ? [0, 1, 1, 1, 1, 1, 1, 1, 1]
        : [0, 1, 1, 1, 1, 1, 1];

    useEffect(() => {
        return () => {
            if (noticeTimerRef.current) {
                clearTimeout(noticeTimerRef.current);
            }
            if (closeTimerRef.current) {
                clearTimeout(closeTimerRef.current);
            }
        };
    }, []);

    const showNotice = (message) => {
        if (noticeTimerRef.current) {
            clearTimeout(noticeTimerRef.current);
        }
        setNotice({
            visible: true,
            message
        });
        noticeTimerRef.current = setTimeout(() => {
            setNotice({
                visible: false,
                message: ""
            });
        }, 2600);
    };

    const resetForm = () => {
        setUserName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
    };

    const closePanel = () => {
        if (noticeTimerRef.current) {
            clearTimeout(noticeTimerRef.current);
        }
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
        }
        setIsRegisterMode(false);
        resetForm();
        setNotice({
            visible: false,
            message: ""
        });
        hiddenLoginHandle();
        playBunnnnn();
    };

    const handleLogin = async () => {
        if (userStore.isLoading) {
            return;
        }
        if (userStore.isLoggedIn) {
            showNotice(`已登录：${userStore.userDisplayName}`);
            return;
        }
        const loginEmail = email.trim();
        if (!loginEmail || !password) {
            if (!loginEmail && !password) {
                showNotice("请输入邮箱和密码");
            } else if (!loginEmail) {
                showNotice("请输入邮箱");
            } else {
                showNotice("请输入密码");
            }
            return;
        }
        const success = await userStore.login(loginEmail, password);
        if (success) {
            showNotice("登录成功");
            if (closeTimerRef.current) {
                clearTimeout(closeTimerRef.current);
            }
            closeTimerRef.current = setTimeout(() => {
                closePanel();
            }, 900);
            return;
        }
        showNotice(userStore.error || "登录失败");
    };

    const handleRegister = async () => {
        if (!isRegisterMode) {
            resetForm();
            setIsRegisterMode(true);
            return;
        }
        if (userStore.isLoading) {
            return;
        }
        const registerName = username.trim();
        const registerEmail = email.trim();
        if (!registerName || !registerEmail || !password || !confirmPassword) {
            showNotice("请完整填写注册信息");
            return;
        }
        if (password !== confirmPassword) {
            showNotice("两次输入的密码不一致");
            return;
        }
        const success = await userStore.register(registerName, registerEmail, password);
        if (success) {
            showNotice("注册成功，请登录");
            setIsRegisterMode(false);
            setUserName("");
            setEmail(registerEmail);
            setPassword("");
            setConfirmPassword("");
            return;
        }
        showNotice(userStore.error || "注册失败");
    };

    return <div className={sideLoginStyle.main + (show ? "": " " + sideLoginStyle.mainHidden)}>
        <div onMouseEnter={() => playBuiu()}
             className={sideLoginStyle.backBtn} onClick={closePanel}>
            <div className={sideLoginStyle.backIcon}>
                <img src={backIconImg} alt=""/>
            </div>
            <div className={sideLoginStyle.backText}/>
        </div>
        <div className={sideLoginStyle.mainPage}>
            <div className={sideLoginStyle.noticeContainer}>
                <div className={sideLoginStyle.notice + (notice.visible ? " " + sideLoginStyle.noticeShow : "")}>
                    <span>{notice.message}</span>
                </div>
            </div>
            <h1/>
            <span className={sideLoginStyle.sentence}>Life is a bear, we must learn to support ourselves.</span>
            <div className={sideLoginStyle.signInBox}>
                <div className={sideLoginStyle.tips}><span>WELCOME</span></div>
                <div className={sideLoginStyle.signInItems}>
                    <R0List style={{
                        width: "100%"
                    }} option={{
                        lights: listLights
                    }}>
                        <span className={sideLoginStyle.signInSpan}>{isRegisterMode ? "REGISTER" : "SIGN IN"}</span>
                        {isRegisterMode ? (
                            <InputItem inputTips={"Username"} id={"InputUsername"}
                                       sendData={(data) => setUserName(data)} value={username}/>
                        ) : (
                            <InputItem inputTips={"Email"} id={"InputEmail"}
                                       sendData={(data) => setEmail(data)} value={email}/>
                        )}
                        {isRegisterMode && (
                            <InputItem inputTips={"Email"} id={"InputEmail"}
                                       sendData={(data) => setEmail(data)} value={email}/>
                        )}
                        <InputItem type="password" inputTips={"Password"} id={"InputPassword"}
                                   sendData={(data) => setPassword(data)} value={password}/>
                        {isRegisterMode && (
                            <InputItem type="password" inputTips={"Confirm Password"} id={"InputConfirmPassword"}
                                       sendData={(data) => setConfirmPassword(data)} value={confirmPassword}/>
                        )}
                        <OptionItem optionTips={isRegisterMode ? "Remember Username" : "Remember Email"} check={true}/>
                        <OptionItem optionTips={"Remember Password"}/>
                        <ButtonItem buttonTips={isRegisterMode ? "Back to sign in" : "Sign in"} onClick={() => {
                            if (isRegisterMode) {
                                resetForm();
                                setIsRegisterMode(false);
                                return;
                            }
                            handleLogin();
                        }}/>
                        <ButtonItem buttonTips={"Create an account"} onClick={handleRegister}/>
                    </R0List>
                </div>
            </div>
        </div>
    </div>;
};
export default SideLogin;
