import {computed, makeAutoObservable} from "mobx";

class color {
    color_name = "";
    hard_color = "";
    background = "";
    list = [];

    constructor(color_name, hard_color, background, list) {
        this.color_name = color_name;
        this.hard_color = hard_color;
        this.background = background;
        this.list = list;
    }
}

class ColorStore {
    colors = [
        new color(
            "pink", "rgba(122, 0, 35, 0.9)", "#ef6da7",
            ["#f270aa", "#e3609a", "#de5b95"],
        ),
        new color(
            "cute_pink", "rgba(236, 109, 113, 0.9)", "#f6bfbc",
            ["#f5b1aa", "#ee827c", "#f09199"],
        ),
        new color(
            "mix_yellow_red", "rgba(240, 131, 0, 0.9)", "#fddea5",
            ["#f7b977", "#ee836f", "#ee7948","#e17b34"],
        ),
        new color(
            "yellow", "rgba(162, 32, 65, 0.9)", "#f3bf88",
            ["#ffec47", "#ffd900", "#f8b500"],
        ),
        new color(
            "normal_blue", "rgba(23, 24, 75, 0.9)", "#165e83",
            ["#274a78", "#2a4073", "#223a70"],
        ),
        new color(
            "little_blue_purple", "rgba(15, 35, 80, 0.9)", "#4d5aaf",
            ["#706caa", "#5654a2", "#4d5aaf", "#4d4398"],
        ),
        new color(
            "green", "rgba(0, 82, 67, 0.9)", "#7ebeab",
            ["#68be8d", "#028760", "#2f5d50"],
        ),
        new color(
            "little_green_blue", "rgba(44, 79, 84, 0.9)", "#bce2e8",
            ["#a0d8ef", "#83ccd2", "#00a3af", "#2a83a2"],
        ),
        new color(
            "white", "rgba(43, 43, 43, 0.9)", "#f8fbf8",
            ["#c0c6c9", "#7d7d7d", "#383c3c"],
        ),
    ];

    constructor() {
        makeAutoObservable(this, {
            randomColor: computed,
        });  // 响应式处理
    }

    get randomColor() {
        const colorLen = this.colors.length;
        const index = Math.round(Math.random() * (colorLen - 1));
        return this.colors[index];
    }
}

const colorStore = new ColorStore();
export default colorStore;