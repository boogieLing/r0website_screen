import {useState, useEffect} from "react";
import globalStore from "@/stores/globalStore";
import {drainPoints, drawLaserPen, setColor, setMaxWidth, setRoundCap} from "laser-pen";
import useLocalStorage from "@/hooks/localStorage";

const useMousePosition = () => {
    const [position, setPosition] = useState({
        clientX: 0,
        clientY: 0,
    });
    const [tail,] = useLocalStorage("printMouseTail", false);
    const updatePosition = event => {
        const {pageX, pageY, clientX, clientY} = event;
        setPosition({
            clientX,
            clientY,
        });
        // 获取 canvas 元素的坐标
        if (globalStore.appCanvasDom) {
            // do nothing.
        } else {
            setColor(
                153, 153, 255
            );
            setMaxWidth(6);
            setRoundCap(true);
            globalStore.setAppCanvasDom(document.querySelector("#" + globalStore.appCanvasId));
        }
        const canvasDom = globalStore.appCanvasDom;
        if (canvasDom) {
            if (globalStore.appCanvasPos) {
            } else {
                globalStore.setAppCanvasPos(canvasDom.getBoundingClientRect());
            }
            if (globalStore.appCanvasCtx) {
            } else {
                globalStore.setAppCanvasCtx(canvasDom.getContext("2d"));
            }
            if (tail) {
                const canvasPos = globalStore.appCanvasPos;
                const ctx = globalStore.appCanvasCtx;
                globalStore.pushMouseTrack({
                    x: clientX - canvasPos.x,
                    y: clientY - canvasPos.y,
                    time: Date.now(),
                });
                startDraw(ctx, canvasDom);
            }
        }
    };

    useEffect(() => {
        document.addEventListener("mousemove", updatePosition, false);
        document.addEventListener("mouseenter", updatePosition, false);
        return () => {
            document.removeEventListener("mousemove", updatePosition);
            document.removeEventListener("mouseenter", updatePosition);
        };
    }, []);

    return position;
};

function startDraw(ctx, canvasDom) {
    if (!globalStore.cursorDrawing) {
        // console.log(ctx);
        globalStore.setCursorDrawingTrue();
        draw(ctx, canvasDom);
    }
}

function draw(ctx, canvasDom) {
    // 参照官方写法：https://github.com/boogieLing/laser-pen/blob/main/example/main.ts
    ctx.clearRect(0, 0, canvasDom.width, canvasDom.height);
    // 过滤掉一些失效的轨迹坐标
    const mouseTrack = drainPoints(globalStore.mouseTrack);
    globalStore.setMouseTrack(mouseTrack);
    let needDrawInNextFrame = false
    if (globalStore.mouseTrack.length >= 3) {
        // 绘制鼠标轨迹
        drawLaserPen(ctx, globalStore.mouseTrack);
        needDrawInNextFrame = true
    }
    const _draw = () => {
        draw(ctx, canvasDom);
    };
    if (needDrawInNextFrame) {
        requestAnimationFrame(_draw); // 鼠标移动停止时回收动画
    } else {
        globalStore.setCursorDrawingFalse(); // 鼠标移动停止时暂停绘画动画
    }

}

export default useMousePosition;