import {computed, makeAutoObservable} from "mobx";

class PicBedStore {
    _curPicIndex = -1;
    _curPicInfo = null;

    constructor() {
        makeAutoObservable(this, {
            curPicIndex: computed,
            curPicInfo: computed,
        });  // 响应式处理
    }

    get curPicIndex() {
        return this._curPicIndex;
    }

    get curPicInfo() {
        return this._curPicInfo;
    }

    setCurPicIndex = (index) => {
        if (index !== this._curPicIndex) {
            this._curPicIndex = index;
        }
    }
    setCurPicInfo = (info) => {
        if (info===null) {
            this._curPicIndex = -1;
        }
        if (info !== this._curPicInfo) {
            this._curPicInfo = info;
        }
    }
}

const picBedStore = new PicBedStore();
export default picBedStore;