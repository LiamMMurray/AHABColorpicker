import React, { useState, useRef, useEffect, Ref } from "react";
import CSS from "csstype";
import SVG from "react-inlinesvg";
import { motion, useMotionValue } from "framer-motion";
import Checkerboard from "@colorpicker/Checkerboard";
import OpacityGradient from "@colorpicker/OpacityGradient";
import HueGradient from "@colorpicker/HueGradient";
import SaturationBrightnessGradient from "@colorpicker/SaturationBrightnessGradient";
import GradientInput from "@colorpicker/GradientInput";
import { vector2 } from "@math/types";
import ColorpickerCursor from "@images/colorpickerCursor.svg";
import { gradientToHue, SaturationBrightnessModifiedColor } from "@math";
// import MyLogo from "../../images/colorpickerCursor.svg";

const ColorPicker = (props: any) => {
  const parentRef: Ref<HTMLDivElement> = useRef(null);
  const saturationBrightnessCursorSize = { x: 16, y: 16 };
  const saturationBrightnessWidth = 128;
  const saturationBrightnessHeight = 128;
  const BarWidth = 10;
  const BarLength = 128;
  const [color, setColor] = useState([255, 0, 0, 255]);
  const [
    saturationBrightnessModifiedColor,
    setSaturationBrightnessModifiedColor,
  ] = useState([255, 0, 0, 255]);
  const [alpha, setAlpha] = useState(1);
  const [parentPos, setParentPos] = useState({ x: 0, y: 0 });
  const [saturationBrightnessInput, setSaturationBrightnessInput] = useState({
    x: 1,
    y: 0,
  });
  const [
    saturationBrightnessMousePos,
    setSaturationBrightnessMousePos,
  ] = useState({ x: saturationBrightnessWidth, y: 0 });
  const [inputMouseDown, setInputMouseDown] = useState(false);

  useEffect(() => {
    const parentRect = parentRef.current?.getClientRects()[0];
    if (parentRect?.x && parentRect?.y) {
      setParentPos({ x: parentRect.x, y: parentRect.y });
      setSaturationBrightnessMousePos({
        x: parentRect.x + saturationBrightnessWidth,
        y: parentRect.y + saturationBrightnessHeight,
      });
    }
  }, []);

  // Swatch preview
  // =========================================================
  const SwatchPreviewRectStyle: CSS.Properties = {
    position: "absolute",
    width: BarWidth * 2 + "px",
    height: BarWidth * 2 + "px",
    top: props.y + BarLength + BarWidth + 2 + 2 + "px",
    left: props.x + "px",
  };
  const SwatchPreviewStyle: CSS.Properties = {
    ...SwatchPreviewRectStyle,
    backgroundColor:
      "rgba(" +
      saturationBrightnessModifiedColor[0] +
      "," +
      saturationBrightnessModifiedColor[1] +
      "," +
      saturationBrightnessModifiedColor[2] +
      "," +
      alpha +
      ")",
  };
  const SwatchPreview = (
    <div>
      <Checkerboard
        x={props.x}
        y={props.y + BarLength + BarWidth + 2 + 2}
        width={BarWidth * 2}
        height={BarWidth * 2}
        patternHeight={3}
        patternWidth={3}
      />
      <div style={SwatchPreviewStyle} />
    </div>
  );
  // Saturation Brightness Input
  // =========================================================
  const SaturationBrightnessCursorStyle: CSS.Properties = {
    position: "absolute",
    left:
      saturationBrightnessMousePos.x -
      saturationBrightnessCursorSize.x / 2 +
      "px",
    top:
      saturationBrightnessMousePos.y -
      saturationBrightnessCursorSize.y / 2 +
      "px",
    width: saturationBrightnessCursorSize.x + "px",
    height: saturationBrightnessCursorSize.y + "px",
  };
  const SaturationBrightnessInput = (
    <GradientInput
      x={props.x}
      y={props.y}
      width={BarLength}
      height={BarLength}
      onChange={(input: vector2) => {
        setSaturationBrightnessMousePos({
          x: input.x * BarLength - parentPos.x,
          y: input.y * BarLength - parentPos.y,
        });
        setSaturationBrightnessModifiedColor(
          SaturationBrightnessModifiedColor(input, color)
        );
        setSaturationBrightnessInput(input);
      }}
      onMouseDown={() => {
        setInputMouseDown(true);
      }}
      onMouseUp={() => {
        setInputMouseDown(false);
      }}
    >
      <SVG src={ColorpickerCursor} style={SaturationBrightnessCursorStyle} />
    </GradientInput>
  );

  // Hue Input
  // =========================================================
  const [hueMousePosition, setHueMousePosition] = useState(0);
  const cursorLength = 4;
  const HueCursorStyle: CSS.Properties = {
    position: "absolute",
    width: BarWidth + "px",
    height: cursorLength + "px",
    top: hueMousePosition - cursorLength / 2 + "px",
    left: "0px",
    backgroundColor: "white",
  };
  const HueInput = (
    <GradientInput
      x={props.x + BarLength + 2}
      y={props.y}
      width={BarWidth}
      height={BarLength}
      onChange={(cursorInput: vector2) => {
        setHueMousePosition(cursorInput.y * BarLength);
        const newHue = [...gradientToHue(1 - cursorInput.y), 255];
        setSaturationBrightnessModifiedColor(
          SaturationBrightnessModifiedColor(saturationBrightnessInput, newHue)
        );
        setColor(newHue);
      }}
      onMouseDown={() => {
        setInputMouseDown(true);
      }}
      onMouseUp={() => {
        setInputMouseDown(false);
      }}
    >
      <div style={HueCursorStyle}></div>
    </GradientInput>
  );

  // Opacity Input
  // =========================================================
  // framer motion test values
  // =========================
  const cursorX = useMotionValue(0);
  // =========================
  const [opacityMousePosition, setOpacityMousePosition] = useState(BarLength);
  const cursorWidth = 4;
  const OpacityInputCursorStyle: CSS.Properties = {
    position: "absolute",
    backgroundColor: "white",
    height: BarWidth + "px",
    width: cursorWidth + "px",
    left: opacityMousePosition - cursorWidth / 2 + "px",
  };
  const OpacityInput = (
    <GradientInput
      width={BarLength}
      height={BarWidth}
      x={props.x}
      y={props.y + BarLength + 2}
      onChange={(input: vector2) => {
        setOpacityMousePosition(input.x * BarLength);
        setAlpha(input.x);
      }}
      onMouseDown={() => {
        setInputMouseDown(true);
      }}
      onMouseUp={() => {
        setInputMouseDown(false);
      }}
    >
      <motion.div style={OpacityInputCursorStyle} whileHover={{ scale: 2 }} />
    </GradientInput>
  );

  // =========================================================================
  const ParentDivStyle: CSS.Properties = {
    position: "absolute",
    left: props.X + "px",
    top: props.Y + "px",
    cursor: inputMouseDown ? "none" : "default",
  };
  return (
    <div id="hideCursorDiv" style={ParentDivStyle} ref={parentRef}>
      <HueGradient
        x={props.x + BarLength + 2}
        y={props.y}
        width={BarWidth}
        height={BarLength}
      />
      <SaturationBrightnessGradient
        x={props.x}
        y={props.y}
        width={BarLength}
        height={BarLength}
        color={color}
      />
      <Checkerboard
        x={props.x}
        y={props.y + BarLength + 2}
        width={BarLength}
        height={BarWidth}
        patternHeight={3}
        patternWidth={3}
      />
      <OpacityGradient
        x={props.x}
        y={props.y + BarLength + 2}
        width={BarLength}
        height={BarWidth}
        color={saturationBrightnessModifiedColor}
      />

      {SaturationBrightnessInput}
      {HueInput}
      {OpacityInput}
      {SwatchPreview}
    </div>
  );
};

export default ColorPicker;
