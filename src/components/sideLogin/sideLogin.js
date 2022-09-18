import sideLoginStyle from "./sideLogin.module.less";
import backIconImg from "./backIcon.png";
import useSound from "use-sound";

import buiu from "@/static/mp3/bu-iu.wav";
import bunnnnn from "@/static/mp3/bunnnnn.wav";

const SideLogin = ({show, hiddenLoginHandle}) => {
    const [playBuiu] = useSound(buiu, {volume: 0.5});
    const [playBunnnnn] = useSound(bunnnnn, {volume: 0.5});

    return <div className={sideLoginStyle.main + " " + (show ? "hiddenLoginHandle": sideLoginStyle.mainHidden)}>
        <div onMouseEnter={() => playBuiu()}
             className={sideLoginStyle.backBtn} onClick={() => {
            hiddenLoginHandle();
            playBunnnnn();
        }}>
            <div className={sideLoginStyle.backIcon}>
                <img src={backIconImg} alt=""/>
            </div>
            <div className={sideLoginStyle.backText}/>
        </div>
        <div className={sideLoginStyle.mainPage}>
            <h1>Login or sign in ?</h1>
        </div>
    </div>;
};
export default SideLogin;