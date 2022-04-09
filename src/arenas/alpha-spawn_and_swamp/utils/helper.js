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



