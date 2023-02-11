import axios from "axios";

const baseUrl = "https://www.shyr0.com/osu";
const imageRoute = "image";
const defaultImage = "968171-MIMI_feat._Hatsune_Miku-Mizuoto_to_Curtain/qt-miku.jpg";
export const GetRandomMap = (handler) => {
    axios.get(baseUrl + "/random_beatmap").then(r => handler(r));
}

export const GetImageUrl = (name, id) => {
    return [baseUrl, imageRoute, name, id].join("/")
}

export const GetDefaultBeatMap = () => {
    return [baseUrl, imageRoute, defaultImage].join("/")
}