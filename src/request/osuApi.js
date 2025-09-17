import axios from "axios";

const baseUrl = "https://www.shyr0.com/osu";
const imageRoute = "image";
const defaultImages = [
    "https://r0picgo-1308801249.cos.ap-guangzhou.myqcloud.com/osu/Hatsune%20Miku/imgs/1052821-DECO_27-Android_Girl_feat._Hatsune_Miku%23Kowari.jpg",
    "https://r0picgo-1308801249.cos.ap-guangzhou.myqcloud.com/osu/Aisaka%20Taiga/imgs/Snipaste_2023-02-27_01-06-24.png",
    "https://r0picgo-1308801249.cos.ap-guangzhou.myqcloud.com/osu/Aisaka%20Taiga/imgs/Snipaste_2023-02-27_01-09-55.png",
];
export const GetRandomMap = (handler) => {
    axios.get(baseUrl + "/random_beatmap").then(r => handler(r));
}

export const GetRandomPicFromTCloud = (handler) => {
    axios.get(baseUrl + "/random_pic").then(r => handler(r));
}
export const GetMainPicAllCategory = (handler) => {
    axios.get(baseUrl + "/main_website_pic/category/total").then(r => handler(r));
}
export const GetMainPicListByCategory = (handler, category, size = 30, marker = null) => {
     axios.post(
        baseUrl + "/main_website_pic/category/list",
        {
            "category": category,
            "size": size,
            "marker": marker
        }
    ).then(r => handler(r));
}
export const GetImageUrl = (name, id) => {
    return [baseUrl, imageRoute, name, id].join("/")
}

export const GetDefaultBeatMap = () => {
    return defaultImages[Math.floor((Math.random() * defaultImages.length))];
}