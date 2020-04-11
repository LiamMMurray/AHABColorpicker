import React, { useEffect } from "react";
import { useState } from "react";
import CSS from "csstype";
import { ClampPointToRect } from "@math";
import { vector2, rect } from "@math/types";

const GradientInput = (props: any) => {
  // const [shouldUpdate, setShouldUpdate] = useState(false);
  const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsMouseDown(true);
    setInitialMousePos({ x: e.clientX, y: e.clientY });
    const normalizedMousePos = {
      x: (e.clientX - props.x) / props.width,
      y: (e.clientY - props.y) / props.height,
    };
    props.onChange(normalizedMousePos);
    props.onMouseDown();
  };
  const handleMouseUp = () => {
    setIsMouseDown(false);
    props.onMouseUp();
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (isMouseDown) {
      const selectorRect: rect = {
        left: props.x,
        top: props.y,
        right: props.x + props.width,
        bottom: props.y + props.height,
      };
      const currentMousePos = { x: e.clientX, y: e.clientY };
      let mousePosClamped: vector2 = ClampPointToRect(
        initialMousePos,
        currentMousePos,
        selectorRect
      );
      mousePosClamped = {
        x: Math.round(mousePosClamped.x),
        y: Math.round(mousePosClamped.y),
      };
      const normalizedMousePos: vector2 = {
        x: (mousePosClamped.x - props.x) / props.width,
        y: (mousePosClamped.y - props.y) / props.height,
      };
      props.onChange(normalizedMousePos);
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isMouseDown]);

  const style: CSS.Properties = {
    position: "absolute",
    width: props.width + "px",
    height: props.height + "px",
    left: props.x + "px",
    top: props.y + "px",
    overflow: "hidden",
  };
  return (
    <div className="noselect" style={style} onMouseDown={handleMouseDown}>
      {props.children}
    </div>
  );
};
GradientInput.defaultProps = {
  onChange: () => {},
  onMouseDown: () => {},
  onMouseUp: () => {},
  x: 0,
  y: 0,
  width: 256,
  height: 256,
};

export default GradientInput;
