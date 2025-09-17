import S from "./bubbling.module.less";
import {memo} from "react";

export const Bubbling = memo(({text, nextPage})=>{
   return <div className={S.bubbling}>
       <button className={S.bubblingBtn} onClick={nextPage}>
           {text}
       </button>
   </div>
});