import {observer} from "mobx-react-lite";
import R0List from "@/components/r0List/r0List";

const Login = (props) => {
    return <div style={{
        position: "fixed",
        left: 0,
        top: 0,
        height: "100vh",
        width: "50vw",
        background: "rgba(0,0,0,0.6)",
        padding: "30px",
    }}>
        <R0List a={1} style={{
            position: "relative",
            background: "rgba(255,255,255,0.6)"
        }}>
            <div style={{height:"100px"}}>qwq</div>
            <span>qaq</span>
        </R0List>
    </div>;
};
export default observer(Login);