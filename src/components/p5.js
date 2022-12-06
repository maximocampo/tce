import React from "react";
import Loadable from "@loadable/component"

const Sketch = Loadable(
    () => import("react-p5")
);

let x = 50;
let y = 50;
export default (props) => {
    
    
    function setup (p5) {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
    
        p5.frameRate(1)
    }
    
    function draw(p5) {
        //if (p5.frameCount % 2) {
            p5.clear()
        //}
        p5.background(248, 248, 248)
        var x = 5;
        var y = 5;
        var scaler = 0;
        var step = 30;
        p5.stroke(100, 100, 100)
        p5.strokeWeight(1)
        p5.noFill()
        for (var i = 0; i < (p5.width * p5.height); i += step) {
            scaler = p5.random(10, 70);
            p5.ellipse(p5.random(x-100, x+100), p5.random(y-100,y+100), scaler, scaler);
            x += p5.random(step-100, step+100);
            if (x >= p5.width) {
                x = 5;
                y += step;
            }
        }
    }
    
    return <Sketch setup={setup} draw={draw} />;
};

