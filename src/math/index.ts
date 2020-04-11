import { vector2, rect } from "./types";
// linear interpolate
export const lerp = (from: number, to: number, by: number): number => {
  return (to - from) * by + from;
};

export const Clamp = (x: number, min: number, max: number) => {
  if (x > max) x = max;
  if (x < min) x = min;
  return x;
};

// takes a matrix index and returns an interpolated value from 0 to 1
// the top being 0 and the bottom being 1
export const gradiateDownwards = (
  width: number,
  height: number,
  index: number
): number => {
  return global.Math.floor(index / width) / (height - 1);
};

// takes a matrix index and returns an interpolated value from 0 to 1
// the far left being 0 and the far right being 1
export const gradiateRightwards = (width: number, index: number): number => {
  return (index % width) / (width - 1);
};

// takes an input of [0 to 1] and maps it to [red-yellow-green-cyan-blue-magenta-red]
export const gradientToHue = (gradientValue: number): number[] => {
  gradientValue = gradientValue % 1;
  // gradient interval: [0/6, 1/6)
  // color interval: [red, yellow)
  if (gradientValue < 1 / 6) {
    const redChannel = 255;
    const greenChannel = lerp(0, 255, gradientValue * 6);
    const blueChannel = 0;
    return [redChannel, greenChannel, blueChannel];
  }
  // interval: [1/6, 2/6)
  // color interval: [yellow, green)
  else if (gradientValue < 2 / 6) {
    const redChannel = lerp(255, 0, (gradientValue - 1 / 6) * 6);
    const greenChannel = 255;
    const blueChannel = 0;
    return [redChannel, greenChannel, blueChannel];
  }
  // interval: [2/6, 3/6)
  // color interval: [green, cyan)
  else if (gradientValue < 3 / 6) {
    const redChannel = 0;
    const greenChannel = 255;
    const blueChannel = lerp(0, 255, (gradientValue - 2 / 6) * 6);
    return [redChannel, greenChannel, blueChannel];
  }
  // interval: [3/6, 4/6)
  // color interval: [cyan, blue)
  else if (gradientValue < 4 / 6) {
    const redChannel = 0;
    const greenChannel = lerp(255, 0, (gradientValue - 3 / 6) * 6);
    const blueChannel = 255;
    return [redChannel, greenChannel, blueChannel];
  }
  // interval: [4/6, 5/6)
  // color interval: [blue, magenta)
  else if (gradientValue < 5 / 6) {
    const redChannel = lerp(0, 255, (gradientValue - 4 / 6) * 6);
    const greenChannel = 0;
    const blueChannel = 255;
    return [redChannel, greenChannel, blueChannel];
  }
  // note that unlike the previous intervals this one includes it's upper bound
  // interval: [5/6, 6/6]
  // color interval: [magenta, red]
  else if (gradientValue <= 6 / 6) {
    const redChannel = 255;
    const greenChannel = 0;
    const blueChannel = lerp(255, 0, (gradientValue - 5 / 6) * 6);
    return [redChannel, greenChannel, blueChannel];
  }
  return [0, 0, 0];
};

// takes an number array with at least 3 elements and returns the highest value from the first 3 elements
export const brightestColorChannelValue = (color: number[]): number => {
  let brightestColorChannelValue: number = color[0];
  for (let i = 1; i < 3; i++) {
    if (color[i] > brightestColorChannelValue)
      brightestColorChannelValue = color[i];
  }
  return brightestColorChannelValue;
};

// returns the xpos of the given index starting at 0
export const matrixXPos = (matrixWidth: number, index: number): number => {
  return index % matrixWidth;
};

// returns the ypos of the given index starting at 0
export const matrixYPos = (matrixWidth: number, index: number): number => {
  return global.Math.floor(index / matrixWidth);
};

// input pos X and pos Y of a pixel matrix starting at 0,0
// returns true if the pixel should be filled with the primary color and false
// if it should be filled with the secondary color
export const centeredCheckerboardPatternCheck = (
  matrixWidth: number,
  matrixHeight: number,
  checkerboardWidth: number,
  checkerboardHeight: number,
  matrixPosX: number,
  matrixPosY: number
): boolean => {
  // the equation below finds the smallest positive offset to apply to the grid so that the checkerboard is centered
  // on an intersection. It does this by doing the following:
  // ....if, for example, we have a canvas length of 8 and a checkeroard box length of 3 our grid would be offcenter and look
  //    like so:
  //
  //                                  |
  //                      [x][x][x][o]|[o][o][x][x]
  //    indices/positions: 0  1  2  3 | 4  5  6  7
  //
  // ....in order to center our grid we need to offset our indices/positions by some amount (in this case +2)
  //                                  |
  //                      [x][o][o][o]|[x][x][x][o]
  //    indices/positions: 0  1  2  3 | 4  5  6  7
  //     offset positions: 2  3  4  5 | 6  7  8  9
  //
  //
  // ....6 is the closest number above the canvas's halfway point of 4 that is divisible by 3 (our checkerboard pattern length).
  //    6 minus 4 is 2. Therefore our positive offset to center our checkerboard pattern is +2
  let checkerboardOffsetH =
    (global.Math.trunc(matrixHeight / 2 / checkerboardHeight) + 1) *
      checkerboardHeight -
    matrixHeight / 2;
  const checkerboardOffsetW =
    (global.Math.trunc(matrixWidth / 2 / checkerboardWidth) + 1) *
      checkerboardWidth -
    matrixWidth / 2;

  // this check returns true if we are within one of the checkewrboard's columns
  const valueW = (matrixPosX + checkerboardOffsetW) / checkerboardWidth;
  // if we are within one of the columns offset the the row so that it pushes out and creates a checkerboard pattern
  if (global.Math.trunc(valueW) % 2) checkerboardOffsetH += checkerboardHeight;

  // this check returns true if we are within one of the checkerboard's rows
  const valueH = (matrixPosY + checkerboardOffsetH) / checkerboardHeight;
  if (global.Math.trunc(valueH) % 2) return true;

  return false;
};

export const slopeOffsets = (v: vector2, slopes: vector2): vector2 => {
  return {
    x: v.y - slopes.x * v.x,
    y: v.x - slopes.y * v.y,
  };
};

export const CompareEqualTo = (
  a: number,
  b: number,
  epsilon: number
): boolean => {
  return global.Math.abs(a - b) < epsilon;
};

export const ClampRayToRect = (
  initial: vector2,
  final: vector2,
  rect: rect
): vector2 => {
  // short circuit if final vector is already within the rect
  if (
    final.x > rect.left &&
    final.x < rect.right &&
    final.y > rect.top &&
    final.y < rect.bottom
  )
    return final;

  const delta: vector2 = {
    x: final.x - initial.x,
    y: final.y - initial.y,
  };

  // short circuit our function if delta x or delta y is close to 0 to avoid division by 0
  if (CompareEqualTo(delta.x, 0, 1)) {
    // our vector intersects the top or bottom boundary at final/initial x position
    return { x: initial.x, y: Clamp(final.y, rect.top, rect.bottom) };
  } else if (CompareEqualTo(delta.y, 0, 1)) {
    // our vector intersects the left or right boundary at final/initial y position
    return { x: Clamp(final.x, rect.left, rect.right), y: initial.y };
  }
  const slopes: vector2 = { x: delta.y / delta.x, y: delta.x / delta.y };
  const _slopeOffsets: vector2 = slopeOffsets(initial, slopes);

  // if delta vector is -x, and -y: check top and left bounds
  if (delta.x < 0 && delta.y < 0) {
    // the y value of where this vector intersects the left boundary
    const leftYIntersection = slopes.x * rect.left + _slopeOffsets.x;
    // the x value of where this vector intersects the top boundary
    const topXIntersection = slopes.y * rect.top + _slopeOffsets.y;

    // our vector intersects the left boundary below the top boundary
    if (leftYIntersection >= rect.top)
      return { x: rect.left, y: leftYIntersection };
    // our vector intersects the top boundary to the right of the left boundary
    else return { x: topXIntersection, y: rect.top };
  }
  // if delta vector is +x and -y: check top and right bounds
  else if (delta.x > 0 && delta.y < 0) {
    // the y value of where this vector intersects the right boundary
    const rightYIntersection = slopes.x * rect.right + _slopeOffsets.x;
    // the x value of where this vector intersects the top boundary
    const topXIntersection = slopes.y * rect.top + _slopeOffsets.y;

    // our vector intersects the right boundary below the top boundary
    if (rightYIntersection >= rect.top)
      return { x: rect.right, y: rightYIntersection };
    // our vector intersects the top boundary to the left of the right boundary
    else return { x: topXIntersection, y: rect.top };
  }
  // if delta vector is -x and +y check bottom and left bounds
  else if (delta.x < 0 && delta.y > 0) {
    // the y value of where this vector intersects the left boundary
    const leftYIntersection = slopes.x * rect.left + _slopeOffsets.x;
    // the x value of where this vector intersects the bottom boundary
    const bottomXIntersection = slopes.y * rect.bottom + _slopeOffsets.y;

    // the delta vector intersects left bounds above the bottom bounds
    if (leftYIntersection <= rect.bottom)
      return { x: rect.left, y: leftYIntersection };
    // the delta vector intersects the bottom bounds to the right of the left bounds
    else return { x: bottomXIntersection, y: rect.bottom };
  }
  // if delta vector is +x, and +y check bottom and right bounds
  else if (delta.x > 0 && delta.y > 0) {
    // the y value of where this vector intersects the right boundary
    const rightYIntersection = slopes.x * rect.right + _slopeOffsets.x;
    // the x value of where this vector intersects the bottom boundary
    const bottomXIntersection = slopes.y * rect.bottom + _slopeOffsets.y;

    // the delta vector intersects the right bounds above the bottom bounds
    if (rightYIntersection <= rect.bottom)
      return { x: rect.right, y: rightYIntersection };
    // the delta vector intersects the bottom bounds to the left of the right bounds
    else return { x: bottomXIntersection, y: rect.bottom };
  }

  return final;
};

export const ClampPointToRect = (
  initial: vector2,
  final: vector2,
  rect: rect
) => {
  const finalVec = {
    x: Clamp(final.x, rect.left, rect.right),
    y: Clamp(final.y, rect.top, rect.bottom),
  };
  return finalVec;
};

export const SaturationBrightnessModifiedColor = (
  input: vector2,
  color: number[]
) => {
  const brightnessModifiedColor = [
    lerp(color[0], 0, input.y),
    lerp(color[1], 0, input.y),
    lerp(color[2], 0, input.y),
  ];
  const bcv = brightestColorChannelValue(brightnessModifiedColor);
  // modify the gradient above to desaturate as it goes left
  const saturationModifiedColor = [
    lerp(brightnessModifiedColor[0], bcv, 1 - input.x),
    lerp(brightnessModifiedColor[1], bcv, 1 - input.x),
    lerp(brightnessModifiedColor[2], bcv, 1 - input.x),
    255,
  ];
  return saturationModifiedColor;
};

export default Math;
