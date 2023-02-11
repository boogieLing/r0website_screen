export const FilingInfo = ({style}) => {
    return <div style={{
        position: "fixed",
        zIndex: "9999",
        ...style
    }}>
        <svg
            d="1667631728696"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1991" width="15" height="15" style={{
            marginRight: "5px",
            marginBottom: "-3px",
            color: "white"
        }}>
            <path
                d="M512 967.111111c170.666667-68.266667 284.444444-164.977778 341.333333-284.444444 73.955556-142.222222 91.022222-307.2 56.888889-500.622223L512 56.888889 113.777778 187.733333c-34.133333 187.733333-17.066667 352.711111 51.2 494.933334C227.555556 802.133333 341.333333 898.844444 512 967.111111z m-295.822222-307.2C153.6 534.755556 136.533333 392.533333 164.977778 227.555556L512 113.777778l347.022222 113.777778c22.755556 164.977778 5.688889 307.2-56.888889 426.666666-51.2 102.4-147.911111 182.044444-290.133333 244.622222-147.911111-56.888889-244.622222-142.222222-295.822222-238.933333z"
                fill="#dfe6e9" p-id="1992"/>
            <path
                d="M512 631.466667L318.577778 438.044444l45.511111-39.822222L512 546.133333 716.8 341.333333l45.511111 39.822223z"
                fill="#dfe6e9" p-id="1993"/>
        </svg>
        <a href="https://beian.miit.gov.cn" style={{
            textDecoration: "none",
            color: "#dfe6e9",
            fontSize: "0.7rem",
            letterSpacing: "0.7px",
            textShadow: "0 0 10px rgba(0,0,0,0.3)"
        }}>
            粤ICP备2022146661号
        </a>
    </div>
}