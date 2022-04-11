import { TOP, TOP_RIGHT, RIGHT, BOTTOM_RIGHT, BOTTOM, BOTTOM_LEFT, LEFT, TOP_LEFT } from "game/constants"
import { getDirection } from "game/utils"

/**
   * 输入简化版bodyArray来获取完全版。part可以为字符串或数组
   * @param {Array} simpleBodyArray - [part: String|Array , i, ...] i为'part'的重复次数
   * @returns {Array} fullBodyArray
   */
export function body(simpleBodyArray) {
  let result = []

  for (let i = 0; i < simpleBodyArray.length; i++) {

    let PART = simpleBodyArray[i]
    if (!PART instanceof Array) {
      if (typeof PART !== 'string') {
        throw new Error('error input of body function')
      }
    }

    let next = simpleBodyArray[i + 1]

    if (typeof next !== 'number') {
      result = result.concat(PART)
    }
    else {
      i++
      // for (; next > 0; next--) {
      //   result = result.concat(PART)
      // }
      result = result.concat(new Array(Math.floor(next)).fill(PART))
    }
  }
  return result
}

export function getOppoDir(dir) {
  switch (dir) {
    case TOP:
      return BOTTOM
    case BOTTOM:
      return TOP
    case LEFT:
      return RIGHT
    case RIGHT:
      return LEFT
    case TOP_LEFT:
      return BOTTOM_RIGHT
    case TOP_RIGHT:
      return BOTTOM_LEFT
    case BOTTOM_LEFT:
      return TOP_RIGHT
    case BOTTOM_RIGHT:
      return TOP_LEFT
    default:
      return null
  }
}

export function getDirectionBetween(from, to) {
  let dx = to.x - from.x
  let dy = to.y - from.y
  return getDirection(dx, dy)
}

export function getRectangleArea(x1, y1, x2, y2, arrayPos = false) {
  if (x1 > x2) return getRectangleArea(x2, y1, x1, y2, arrayPos)
  if (y1 > y2) return getRectangleArea(x1, y2, x2, y1, arrayPos)
  let area = [];
  for (let i = x1; i <= x2; i++) {
    for (let j = y1; j <= y2; j++) {
      if (arrayPos) {
        area.push([i, j]);
      } else {
        area.push({ x: i, y: j });
      }
    }
  }
  return area;

}

export function getBoundaryCoordinate(x1, y1, x2, y2, arrayPos) {
  if (x1 > x2) return getBoundaryCoordinate(x2, y1, x1, y2, arrayPos)
  if (y1 > y2) return getBoundaryCoordinate(x1, y2, x2, y1, arrayPos)


  let boundary = []
  for (let x = x1; x <= x2; x++) {
    for (let y of [y1, y2]) {
      if (arrayPos) {
        boundary.push([x, y]);
      } else {
        boundary.push({ x: x, y: y });
      }
    }
  }
  for (let y = y1; y <= y2; y++) {
    for (let x of [x1, x2]) {

      if (x === x1 && y === y1) { continue }
      if (x === x1 && y === y2) { continue }
      if (x === x2 && y === y1) { continue }
      if (x === x2 && y === y2) { continue }

      if (arrayPos) {
        boundary.push([x, y]);
      } else {
        boundary.push({ x: x, y: y });
      }
    }
  }
  return boundary

}

/**
 * 
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} range 
 * @param {Boolean} arrayPos 
 * @returns 
 */
export function getSquardArea(x, y, range, arrayPos) {
  return getRectangleArea(x - range, y - range, x + range, y + range, arrayPos)
}
