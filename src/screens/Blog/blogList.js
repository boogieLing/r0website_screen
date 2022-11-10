import blogListStyle from "./blogList.module.less";
import {BlogListItem} from "@/screens/Blog/blogListItem";
import ColoredScrollbars from "@/components/ScrollBars/ColorScrollBars";

export const BlogList = ({posts}) => {
    return <ColoredScrollbars
        style={{
            position: "absolute",
            top: "100px",
            right: 0,
            width: "500px",
            height: "calc(100% - 220px)", //TODO 丑陋的写法，实际上高度需要根据less变量计算得出
        }}>
        <div className={blogListStyle.blogListBox}>
            {posts.map((post) => {
                return <BlogListItem
                    post={post} key={post._id}
                />
            })}
        </div>
    </ColoredScrollbars>
};