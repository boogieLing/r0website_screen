import blogStyle from "./index.module.less";

import {observer} from 'mobx-react-lite';
import {useCallback, useEffect, useState} from "react";

import {getPostListByR0} from "@/request/blogApi";
import {BlogTop} from "@/screens/Blog/blogTop";
import osuStore from "@/stores/osuStore";

const Blog = (props) => {
    console.log("blog render");
    const [pageParams, setPageParams] = useState({
        number: 1,
        size: 20
    });
    const [blogBackground, setBlogBackground] = useState("");
    const getPostIds = useCallback(() => {
        getPostListByR0(pageParams, (r) => {
            const {data} = r.data;
            const {total_count, page_number, page_size} = data;
            if (Number(page_number) * Number(page_size) < Number(total_count)) {
                // 如果还有剩余的数据，推进页码
                setPageParams({
                    ...pageParams,
                    number: Number(page_number) + 1
                });
            }
        });
    }, [])
    useEffect(() => {
        getPostIds();
        osuStore.getRandomBeatmap().then(_ => {
            setBlogBackground(osuStore.curImageUrl);
        });

    }, [])
    return <div className={blogStyle.blogMain}>
        <div className={blogStyle.blogBackgroundBox}>
            <div className={blogStyle.backGroundColor}/>
            <div className={blogStyle.backGroundImg}>
                <img src={blogBackground} alt="" className={blogStyle.backGroundImg}/>
            </div>
        </div>
        <BlogTop/>
    </div>;
};
export default observer(Blog);