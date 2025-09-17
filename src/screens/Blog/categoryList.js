import categoryListStyle from "./categoryList.module.less";
import {useCallback, useEffect, useLayoutEffect, useState} from "react";
import {getCategories} from "@/request/blogApi";

export const CategoryList = ({style}) => {
    const [categories, setCategories] = useState([]);
    const loadCategories = useCallback(() => {
        getCategories((r) => {
            const {code, data, msg} = r.data;
            const {categories, total_count} = data;
            setCategories(categories);
        })
    }, []);
    useLayoutEffect(() => {
        loadCategories();
    }, []);
    return <div style={{...style}} className={categoryListStyle.cateGoryList}>
        <div className={categoryListStyle.mainListBox}>
            {categories.map((category) => {
                return <a className={categoryListStyle.itemBox} key={category.Id}
                          href={"/category/"+category.name} target="_blank">
                    {category.name}({category.count})
                </a>
            })}
        </div>
    </div>
}