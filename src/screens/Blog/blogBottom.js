import S from "./blogBottom.module.less";
import sideLoginStyle from "@/components/sideLogin/sideLogin.module.less";
import backIconImg from "@/components/sideLogin/backIcon.png";
import thinking from "@/static/pic/thinking.png";
import coffee_cat from "@/static/pic/coffee_cat.png";
import {ShowR0} from "@/components/r0/showR0";

export const BlogBottom = ({props, children}) => {
    return <div className={S.blogBottomBox}>
        <div
            className={sideLoginStyle.backBtn}
            style={{
                bottom: "50px"
            }}
        >
            <div className={sideLoginStyle.backIcon}>
                <img src={backIconImg} alt=""/>
            </div>
            <div className={sideLoginStyle.backText}/>
        </div>
        <ul className={S.navigationBar}>
            <li className={S.navigation}>
                <div className={S.nIconBox}><img src={thinking} alt=""/></div>
                <span className={S.nTitle}>Thinking</span>
            </li>
            <li className={S.navigation}>
                <div className={S.nIconBox}><img src={coffee_cat} alt="" className={S.longImg}/></div>
                <span className={S.nTitle}>More</span>
            </li>
            <ShowR0 style={{
                position: "absolute",
                left: "120%",
                bottom: "3px",
                marginRight:"30px",
            }}/>
        </ul>
        {children}
    </div>
}