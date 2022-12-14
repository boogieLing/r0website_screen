import {computed, makeAutoObservable} from "mobx";
import axios from "axios";

class Beatmap {
    name = "";
    images = [];
    songs = [];

    constructor(name, images, songs) {
        this.name = name;
        this.images = images;
        this.songs = songs;
    }
}

class OsuStore {
    beatmapSet = []; // 定义数据
    curBeatmap = null;
    // baseUrl = "https://www.r0r0.pink/osu";
    baseUrl = "http://101.33.218.37:11312";
    imageRoute = "image";
    defaultImage = "968171-MIMI_feat._Hatsune_Miku-Mizuoto_to_Curtain/qt-miku.jpg";

    constructor() {
        makeAutoObservable(this, {
            curImages: computed,
            curImageUrl: computed
        });  // 响应式处理
    }

    // 只要调用这个方法 就可以从后端拿到数据并且存入channelList
    getRandomBeatmap = async () => {
        const res = await axios.get(this.baseUrl + "/random_beatmap");
        this.setCurBeatmap(res.data.name, res.data.data.images, res.data.data.songs);
        this.beatmapSet.push(this.curBeatmap);
    };

    get curImageUrl() {
        if (this.curBeatmap && this.curBeatmap.images.length > 0) {
            return [
                this.baseUrl,
                this.imageRoute,
                this.curBeatmap.name,
                this.curBeatmap.images[0]
            ].join("/");
        } else {
            return this.getDefaultImageUrl();
        }
    };

    get curImages() {
        if (this.curBeatmap.images.length > 0) {
            return this.curBeatmap.images;
        } else {
            return [this.getDefaultImageUrl()];
        }
    };

    getDefaultImageUrl = () => {
        return [
            this.baseUrl,
            this.imageRoute,
            this.defaultImage,
        ].join("/");
    };
    setCurBeatmap = (name, images, songs) => {
        this.curBeatmap = new Beatmap(name, images,songs);
    };
}

const osuStore = new OsuStore();
export default osuStore;