import React, { useRef, Ref, useEffect } from "react";
import CSS from "csstype";
import {
  matrixXPos,
  matrixYPos,
  centeredCheckerboardPatternCheck,
} from "@math";
import CheckerboardPropsType from "@colorpicker/Checkerboard.types";

const Checkerboard = (props: CheckerboardPropsType) => {
  const canvasRef: Ref<HTMLCanvasElement> = useRef(null);

  // update image data on canvas
  useEffect(() => {
    if (canvasRef.current) {
      console.log("re-render");
      const ctx = canvasRef.current.getContext("2d");
      // freeze the current canvas frame to avoid flickering

      let imageData = ctx?.createImageData(props.width, props.height);

      if (ctx && imageData) {
        const pixelCount = props.width * props.height;

        for (let i = 0; i < pixelCount * 4; i += 4) {
          const posX = matrixXPos(props.width, i / 4);
          const posY = matrixYPos(props.width, i / 4);
          if (
            centeredCheckerboardPatternCheck(
              props.width,
              props.height,
              props.patternWidth,
              props.patternHeight,
              posX,
              posY
            )
          ) {
            // for each color channel within this pixel
            // R:
            imageData.data[i + 0] = props.color1[0];
            // G:
            imageData.data[i + 1] = props.color1[1];
            // B:
            imageData.data[i + 2] = props.color1[2];
            // A:
            imageData.data[i + 3] = props.color1[3];
          } else {
            // for each color channel within this pixel
            // R:
            imageData.data[i + 0] = props.color2[0];
            // G:
            imageData.data[i + 1] = props.color2[1];
            // B:
            imageData.data[i + 2] = props.color2[2];
            // A:
            imageData.data[i + 3] = props.color2[3];
          }
        }
        ctx.putImageData(imageData, 0, 0);
      }
    }
  }, [canvasRef, props.color1, props.color2, props.width, props.height]);

  const style: CSS.Properties = {
    position: "absolute",
    top: props.y + "px",
    left: props.x + "px",
    width: props.width + "px",
    height: props.height + "px",
  };

  return (
    <canvas
      ref={canvasRef}
      width={props.width}
      height={props.height}
      style={style}
    />
  );
};

Checkerboard.defaultProps = {
  width: 256,
  height: 256,
  clientX: 0,
  clientY: 0,
  patternWidth: 8,
  patternHeight: 8,
  color1: [127, 127, 127, 127],
  color2: [255, 255, 255, 64],
};

export default Checkerboard;
