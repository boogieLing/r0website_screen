import sideLoginStyle from "./sideLogin.module.less";

const ButtonItem = ({buttonTips, onClick}) => {
    return <div className={sideLoginStyle.buttonItem} onClick={onClick}>
        <span className={sideLoginStyle.buttonTips}>{buttonTips}</span>
    </div>;
};
export default ButtonItem;
