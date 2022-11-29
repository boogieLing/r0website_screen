import {computed, makeAutoObservable} from "mobx";

class CurPostStore {
    _id = "";
    _heads = [];

    constructor() {
        makeAutoObservable(this, {
            id: computed,
            heads: computed,
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
}

const curPostStore = new CurPostStore();
export default curPostStore;