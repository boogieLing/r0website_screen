import {observer} from "mobx-react-lite";
import R0List from "@/components/r0List/r0List";

const Test = () => {
    return <div style={{
        position: "fixed",
        left: 0,
        top: 0,
        height: "100vh",
        width: "50vw",
        background: "rgba(0,0,0,0.6)",
        padding: "30px",
    }}>
        <R0List>
            <div style={{height: "100px"}}>qwq</div>
            <span style={{height: "150px", display: "block"}}/>
        </R0List>
    </div>;
};
export default observer(Test);