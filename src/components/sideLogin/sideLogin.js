import sideLoginStyle from "./sideLogin.module.less";
import backIconImg from "./backIcon.png";
import useSound from "use-sound";
import buiu from "@/static/mp3/bu-iu.wav";
import bunnnnn from "@/static/mp3/bunnnnn.wav";
import {useState} from "react";
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

    const closePanel = () => {
        setIsRegisterMode(false);
        setEmail("");
        setConfirmPassword("");
        hiddenLoginHandle();
        playBunnnnn();
    };

    const handleLogin = async () => {
        if (userStore.isLoading) {
            return;
        }
        const email = username.trim();
        if (!email || !password) {
            window.alert("请输入用户名和密码");
            return;
        }
        const success = await userStore.login(email, password);
        if (success) {
            window.alert("登录成功");
            closePanel();
            return;
        }
        window.alert(userStore.error || "登录失败");
    };

    const handleRegister = async () => {
        if (!isRegisterMode) {
            setIsRegisterMode(true);
            return;
        }
        if (userStore.isLoading) {
            return;
        }
        const registerName = username.trim();
        const registerEmail = email.trim();
        if (!registerName || !registerEmail || !password || !confirmPassword) {
            window.alert("请完整填写注册信息");
            return;
        }
        if (password !== confirmPassword) {
            window.alert("两次输入的密码不一致");
            return;
        }
        const success = await userStore.register(registerName, registerEmail, password);
        if (success) {
            window.alert("注册成功，请登录");
            setIsRegisterMode(false);
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            return;
        }
        window.alert(userStore.error || "注册失败");
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
            <h1>今日天气不错！</h1>
            <span className={sideLoginStyle.sentence}>Life is a bear, we must learn to support ourselves.</span>
            <div className={sideLoginStyle.signInBox}>
                <div className={sideLoginStyle.tips}><span>WELCOME</span></div>
                <div className={sideLoginStyle.signInItems}>
                    <R0List style={{
                        width: "100%"
                    }} option={{
                        lights: [0, 0, 0, 1, 1, 0, 0]
                    }}>
                        <span className={sideLoginStyle.signInSpan}>{isRegisterMode ? "REGISTER" : "SIGN IN"}</span>
                        <InputItem inputTips={"Username"} id={"InputUsername"}
                                   sendData={(data) => setUserName(data)}/>
                        {isRegisterMode && (
                            <InputItem inputTips={"Email"} id={"InputEmail"}
                                       sendData={(data) => setEmail(data)}/>
                        )}
                        <InputItem type="password" inputTips={"Password"} id={"InputPassword"}
                                   sendData={(data) => setPassword(data)}/>
                        {isRegisterMode && (
                            <InputItem type="password" inputTips={"Confirm Password"} id={"InputConfirmPassword"}
                                       sendData={(data) => setConfirmPassword(data)}/>
                        )}
                        <OptionItem optionTips={"Remember Username"} check={true}/>
                        <OptionItem optionTips={"Remember Password"}/>
                        <ButtonItem buttonTips={isRegisterMode ? "Back to sign in" : "Sign in"} onClick={() => {
                            if (isRegisterMode) {
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
