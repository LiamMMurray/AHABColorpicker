import React, { useEffect, useRef, Ref } from "react";
import CSS from "csstype";
import { gradiateDownwards, gradientToHue } from "@math";
import HueGradientPropsType from "@colorpicker/HueGradient.types";

const HueGradient = (props: HueGradientPropsType) => {
  const canvasRef: Ref<HTMLCanvasElement> = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      let imageData = ctx?.createImageData(props.width, props.height);

      if (ctx && imageData) {
        const pixelCount = props.width * props.height;

        for (let i = 0; i < pixelCount * 4; i += 4) {
          const downwardsGradient = gradiateDownwards(
            props.width,
            props.height,
            i / 4
          );
          const hueColor = gradientToHue(1 - downwardsGradient);
          // for each color channel within this pixel
          // R:
          imageData.data[i + 0] = hueColor[0];
          // G:
          imageData.data[i + 1] = hueColor[1];
          // B:
          imageData.data[i + 2] = hueColor[2];
          // A:
          imageData.data[i + 3] = props.alpha;
        }
        ctx.putImageData(imageData, 0, 0);
      }
    }
  }, [canvasRef, props.alpha, props.width, props.height]);

  const style: CSS.Properties = {
    position: "absolute",
    left: props.x + "px",
    top: props.y + "px",
    width: props.width + "px",
    height: props.height + "px",
  };

  return (
    <canvas
      ref={canvasRef}
      width={props.width}
      height={props.height}
      style={style}
    ></canvas>
  );
};

HueGradient.defaultProps = {
  x: 0,
  y: 0,
  width: 256,
  height: 256,
  alpha: 255,
};

export default HueGradient;
