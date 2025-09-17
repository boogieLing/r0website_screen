import {computed, makeAutoObservable} from "mobx";

class CurPostStore {
    _id = "";
    _heads = [];
    _curTitle = "";
    _isDown = true;
    constructor() {
        makeAutoObservable(this, {
            id: computed,
            heads: computed,
            curTitle: computed,
            isDown:computed,
        });  // 响应式处理
    }

    get id() {
        return this._id;
    }

    get heads() {
        if (!this._heads) {
            this._heads = [];
        }
        return this._heads;
    }
    get curTitle() {
        return this._curTitle;
    }
    get isDown() {
        return this._isDown;
    }
    setId = (id) => {
        if (id !== this._id) {
            this._id = id;
        }
    }
    setHead = (heads) => {
        this._heads = heads;
    }
    clearHead = () => {
        this._heads = [];
    }
    setCurTitle = (title) => {
        this._curTitle = title;
    }
    setIsDown = (isDown) =>{
        this._isDown = isDown;
    }
}

const curPostStore = new CurPostStore();
export default curPostStore;