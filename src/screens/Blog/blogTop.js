import blogTopStyle from "./blogTop.module.less";

export const BlogTop = () => {
    return <div className={blogTopStyle.blogTopBox}>
        <div className={blogTopStyle.borderLeftBottom + " " + blogTopStyle.borderClone}/>
        <div className={blogTopStyle.borderRight + " " + blogTopStyle.borderClone}/>
        <div className={blogTopStyle.borderLeftBottom}/>
        <div className={blogTopStyle.borderRightBack}/>
        <div className={blogTopStyle.borderRight}/>
        <div className={blogTopStyle.backLeft}/>
        <div className={blogTopStyle.backRight}/>
    </div>
};