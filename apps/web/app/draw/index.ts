type Shape = {
    type: "rect",
    x: number,
    y: number,
    width: number,
    height: number   
} | {
    type: "circle",
    x: number,
    y: number,
    width: number,
    height: number
};

export default function initDraw(canvas:HTMLCanvasElement){
    const ctx = canvas.getContext("2d");
    
    let existingShape: Shape[] = [];
    if(!ctx) return;

    ctx.fillStyle = "rgba(0,0,0)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    let clicked = false;    
    let startX = 0;
    let startY = 0;
    
    canvas.addEventListener("mousedown",(e)=>{
        clicked = true;
        startX = e.clientX - canvas.offsetLeft;
        startY = e.clientY - canvas.offsetTop;
    });

    canvas.addEventListener("mouseup",(e)=>{
        clicked = false;
        const width = (e.clientX - canvas.offsetLeft) - startX;
        const height = (e.clientY - canvas.offsetTop) - startY;

        existingShape.push({
            type:"rect",
            x:startX,
            y:startY,
            height,
            width
        });
    });

    canvas.addEventListener("mousemove",(e)=>{
        if(clicked){
            const width = (e.clientX - canvas.offsetLeft) - startX;
            const height = (e.clientY - canvas.offsetTop) - startY;

            clearCanvas(existingShape,canvas,ctx);
            ctx.strokeStyle = "rgba(255,255,255)";
            ctx.strokeRect(startX,startY,width,height);
        }
    });
}

function clearCanvas(existingShape:Shape[],canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "rgba(0,0,0)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    existingShape.forEach((shape)=>{
        if(shape.type === "rect"){
            ctx.strokeStyle = "rgba(255,255,255)";
            ctx.strokeRect(shape.x,shape.y,shape.width,shape.height);
        }
    });
}
