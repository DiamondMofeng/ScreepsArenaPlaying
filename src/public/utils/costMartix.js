import { getObjectsByPrototype } from "game/utils";
import { CostMatrix } from "game/path-finder";

import { getRectangleArea } from "./helper";






/**
 * enemy一格内会被设为禁止通行
 * @param {Array} enemies
 */
export function avoidTouch(enemies) {

  let costs = new CostMatrix;

  enemies.forEach(enemy => {
    let area = getRectangleArea(enemy.x - 1, enemy.y - 1, enemy.x + 1, enemy.y + 1);
    area.forEach(pos => {
      costs.set(pos.x, pos.y, 0xFF)
    })
  })

  return costs

}



