import globalStore from "@/stores/globalStore";
import {observer} from "mobx-react-lite";

const Login = (props) => {
    console.log(globalStore.appCanvasCtx);
    return <div>
        login
        {props.children}
    </div>;
};
export default observer(Login);