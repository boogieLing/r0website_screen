import blogBottomStyle from "./blogBottom.module.less";
import sideLoginStyle from "@/components/sideLogin/sideLogin.module.less";
import backIconImg from "@/components/sideLogin/backIcon.png";
import buiu from "@/static/mp3/bu-iu.wav";
import bunnnnn from "@/static/mp3/bunnnnn.wav";
import useSound from "use-sound";

export const BlogBottom = ({props, children}) => {
    const [playBuiu] = useSound(buiu, {volume: 0.3});
    const [playBunnnnn] = useSound(bunnnnn, {volume: 0.3});

    return <div className={blogBottomStyle.blogBottomBox}>
        <div
            className={sideLoginStyle.backBtn}
            onMouseEnter={() => playBuiu()}
            onClick={() => playBunnnnn()}
            style={{
                bottom: "50px"
            }}
        >
            <div className={sideLoginStyle.backIcon}>
                <img src={backIconImg} alt=""/>
            </div>
            <div className={sideLoginStyle.backText}/>
        </div>
        {children}
    </div>
}