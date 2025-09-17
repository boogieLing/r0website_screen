import blogStyle from "./index.module.less";
import {memo} from "react";

export const BlogBackground = memo(({backImg}) => {
    return <div className={blogStyle.blogBackgroundBox}>
        <div className={blogStyle.backGroundColor}/>
        <div className={blogStyle.backGroundImg}>
            <img src={backImg} alt="" className={blogStyle.backGroundImg}/>
        </div>
    </div>
});