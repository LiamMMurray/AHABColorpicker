import React, { useEffect, useRef, Ref } from "react";
import CSS from "csstype";
import {
  lerp,
  gradiateDownwards,
  gradiateRightwards,
  brightestColorChannelValue,
} from "@math";
import SaturationBrightnessGradientPropsType from "@colorpicker/SaturationBrightnessGradient.types";

const SaturationBrightnessGradient = (
  props: SaturationBrightnessGradientPropsType
) => {
  const canvasRef: Ref<HTMLCanvasElement> = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      let imageData = ctx?.createImageData(props.width, props.height);

      if (ctx && imageData) {
        // generate HSB gradient
        const pixelCount = props.width * props.height;

        for (let i = 0; i < pixelCount * 4; i += 4) {
          const downwardsGradient = gradiateDownwards(
            props.width,
            props.height,
            i / 4
          );
          const rightwardsGradient = gradiateRightwards(props.width, i / 4);
          // generate gradient that has max saturation going from light to dark
          const brightnessModifiedColor = [
            lerp(props.color[0], 0, downwardsGradient),
            lerp(props.color[1], 0, downwardsGradient),
            lerp(props.color[2], 0, downwardsGradient),
          ];
          const bcv = brightestColorChannelValue(brightnessModifiedColor);
          // modify the gradient above to desaturate as it goes left
          const saturationModifiedColor = [
            lerp(brightnessModifiedColor[0], bcv, 1 - rightwardsGradient),
            lerp(brightnessModifiedColor[1], bcv, 1 - rightwardsGradient),
            lerp(brightnessModifiedColor[2], bcv, 1 - rightwardsGradient),
          ];
          // for each color channel within this pixel
          // R:
          imageData.data[i + 0] = saturationModifiedColor[0];
          // G:
          imageData.data[i + 1] = saturationModifiedColor[1];
          // B:
          imageData.data[i + 2] = saturationModifiedColor[2];
          // A:
          imageData.data[i + 3] = props.color[3];
        }
        ctx.putImageData(imageData, 0, 0);
      }
    }
  }, [props.color, props.width, props.height]);

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

SaturationBrightnessGradient.defaultProps = {
  color: [255, 0, 0, 255],
  alpha: 255,
  width: 256,
  height: 256,
  x: 0,
  y: 0,
};

export default SaturationBrightnessGradient;
