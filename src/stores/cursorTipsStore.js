import {computed, makeAutoObservable} from "mobx";

class CursorTipsStore {
    _mouseTips = [];

    constructor() {
        makeAutoObservable(this, {
            mouseTips: computed,
        });  // 响应式处理
    }

    get mouseTips() {
        return this._mouseTips;
    }

    addTips = (tips) => {
        this._mouseTips.push(tips);
    }

    popTips = () => {
        this._mouseTips.pop();
    }

    clearTips = () => {
        this._mouseTips = [];
    }
}

const cursorTipsStore = new CursorTipsStore();
export default cursorTipsStore;