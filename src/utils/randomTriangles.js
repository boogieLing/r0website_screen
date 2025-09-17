export const randomIsoscelesTriangles = (canvas, width, height, color_arr) => {
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 0;
    const limit = Math.min(width, height) / 5;
    for (let i = color_arr.length - 1; i >= 0; --i) {
        for (let j = 0; j < limit; ++j) {
            randomIsoscelesTriangle(
                ctx,
                0, 0,
                width, height,
                color_arr[i], i, color_arr, 60 * i + 10, limit
            );
        }
    }
};
export const clearTriangles = (canvas, width, height) => {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
};

function randomIsoscelesTriangle(
    ctx, minWidth, minHeight, maxWidth, maxHeight, fillStyle, index, arr, threshold, limit,
) {
    // 注意，这里是故意不检查边界是否越界的！
    let startX = Math.random() * (maxWidth - minWidth) + minWidth;
    let endX = startX + Math.random() * (10 + threshold) + threshold;
    let startY = Math.random() * (maxHeight - minHeight) + minHeight;
    let endY = startY;
    let triangleHeight = 1.7320508 / 2 * (endX - startX);
    let pX1 = endX - (endX - startX) / 2;
    let pY1 = endY - triangleHeight;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(pX1, pY1);
    ctx.lineTo(endX, endY);
    ctx.fillStyle = fillStyle;
    ctx.fill();
    ctx.closePath();
    for (let i = 0; i < index; ++i) {
        // 如果是靠后的颜色，说明是深色，在这之上再生成一个浅色的三角形
        randomIsoscelesTriangle(
            ctx,
            startX - limit, pY1 - limit,
            endX + limit, endY + limit,
            arr[index - 1], index - 1, arr, threshold / 1.5
        );
    }
}

