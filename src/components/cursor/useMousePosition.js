import {useState, useEffect} from "react";
import globalStore from "@/stores/globalStore";
import {drainPoints, drawLaserPen, setColor, setMaxWidth, setRoundCap} from "laser-pen";

const useMousePosition = () => {
    const [position, setPosition] = useState({
        clientX: 0,
        clientY: 0,
    });

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
            const canvasPos = globalStore.appCanvasPos;
            const ctx = globalStore.appCanvasCtx;
            globalStore.pushMouseTrack({
                x: clientX - canvasPos.x,
                y: clientY - canvasPos.y,
                time: Date.now(),
            });
            startDraw(ctx, canvasDom);
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
    ctx.clearRect(0, 0, canvasDom.width, canvasDom.height);
    // 过滤掉一些失效的轨迹坐标
    const mouseTrack = drainPoints(globalStore.mouseTrack);
    globalStore.setMouseTrack(mouseTrack);
    if (globalStore.mouseTrack.length >= 3) {
        // 绘制鼠标轨迹
        setColor(
            153, 153, 255
        );
        setMaxWidth(6);
        setRoundCap(true);
        drawLaserPen(ctx, globalStore.mouseTrack);
    }
    globalStore.setCursorDrawingFalse();
}

export default useMousePosition;