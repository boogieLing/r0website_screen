import sideLoginStyle from "./sideLogin.module.less";

const ButtonItem = ({buttonTips}) => {
    return <div className={sideLoginStyle.buttonItem}>
        <span className={sideLoginStyle.buttonTips}>{buttonTips}</span>
    </div>;
};
export default ButtonItem;