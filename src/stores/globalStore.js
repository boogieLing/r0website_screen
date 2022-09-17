import {computed} from "mobx";

const {makeAutoObservable} = require("mobx");

class GlobalStore {
    _webSiteTitle = "R0!";
    _homeId = "homeLayout";
    _appCanvasId = "appCanvasId";
    _appCanvasDom = null;
    _appCanvasPos = null;
    _appCanvasCtx = null;
    _cursorDrawing = false;
    _mouseTrack = [];

    constructor() {
        makeAutoObservable(this, {
            webSiteTitle: computed,
            homeId: computed,
            appCanvasId: computed,
            cursorDrawing: computed,
            mouseTrack: computed,
            appCanvasDom: computed,
            appCanvasPos: computed,
            appCanvasCtx: computed,
        });  // 响应式处理
    }

    get webSiteTitle() {
        return this._webSiteTitle;
    }

    get homeId() {
        return this._homeId;
    }

    get appCanvasId() {
        return this._appCanvasId;
    }

    get cursorDrawing() {
        return this._cursorDrawing;
    }

    setCursorDrawingTrue = () => {
        this._cursorDrawing = true;
    };

    setCursorDrawingFalse = () => {
        this._cursorDrawing = false;
    };

    get mouseTrack() {
        return this._mouseTrack;
    }

    setMouseTrack = (mouseTrack) => {
        this._mouseTrack = mouseTrack;
    };
    pushMouseTrack = (item) => {
        this._mouseTrack.push(item);
    };

    get appCanvasDom() {
        return this._appCanvasDom;
    }

    get appCanvasPos() {
        return this._appCanvasPos;
    }

    get appCanvasCtx() {
        return this._appCanvasCtx;
    }

    setAppCanvasDom = (item) => {
        this._appCanvasDom = item;
    };
    setAppCanvasPos = (item) => {
        this._appCanvasPos = item;
    };
    setAppCanvasCtx = (item) => {
        this._appCanvasCtx = item;
    };

}

const globalStore = new GlobalStore();
export default globalStore;