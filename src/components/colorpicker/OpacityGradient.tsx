import React, { useEffect, useRef, Ref } from "react";
import CSS from "csstype";
import { gradiateRightwards } from "@math";
import OpacityGradientPropsType from "@colorpicker/OpacityGradient.types";

const OpacityGradient = (props: OpacityGradientPropsType) => {
  const canvasRef: Ref<HTMLCanvasElement> = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      let imageData = ctx?.createImageData(props.width, props.height);

      if (ctx && imageData) {
        // generate HSB gradient
        const pixelCount = props.width * props.height;

        for (let i = 0; i < pixelCount * 4; i += 4) {
          const rightGradient = gradiateRightwards(props.width, i / 4);
          // for each color channel within this pixel
          // R:
          imageData.data[i + 0] = props.color[0];
          // G:
          imageData.data[i + 1] = props.color[1];
          // B:
          imageData.data[i + 2] = props.color[2];
          // A:
          imageData.data[i + 3] = Math.round(props.color[3] * rightGradient);
        }
        ctx.putImageData(imageData, 0, 0);
      }
    }
  }, [props.color, props.width, props.height]);

  const style: CSS.Properties = {
    position: "absolute",
    width: props.width + "px",
    height: props.height + "px",
    left: props.x + "px",
    top: props.y + "px", //props.y + "px",
  };

  return (
    <div style={style}>
      <canvas
        ref={canvasRef}
        width={props.width}
        height={props.height}
        style={{ position: "absolute", left: 0 + "px", top: 0 + "px" }}
      ></canvas>
    </div>
  );
};

OpacityGradient.defaultProps = {
  x: 0,
  y: 0,
  width: 128,
  height: 128,
  color: [255, 0, 0, 255],
};

export default OpacityGradient;
