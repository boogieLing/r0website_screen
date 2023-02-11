import {computed, makeAutoObservable} from "mobx";
import axios from "axios";
import {GetDefaultBeatMap, GetImageUrl, GetRandomMap} from "@/request/osuApi";

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

    constructor() {
        makeAutoObservable(this, {
            curImages: computed,
            curImageUrl: computed
        });  // 响应式处理
    }

    // 只要调用这个方法 就可以从后端拿到数据并且存入channelList
    getRandomBeatmap = async () => {
        GetRandomMap((r) => {
            this.setCurBeatmap(r.data.name, r.data.data.images, r.data.data.songs);
            this.beatmapSet.push(this.curBeatmap);
        })
    };

    get curImageUrl() {
        if (this.curBeatmap && this.curBeatmap.images.length > 0) {
            return GetImageUrl(this.curBeatmap.name, this.curBeatmap.images[0]);
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
        return GetDefaultBeatMap();
    };
    setCurBeatmap = (name, images, songs) => {
        this.curBeatmap = new Beatmap(name, images, songs);
    };
}

const osuStore = new OsuStore();
export default osuStore;