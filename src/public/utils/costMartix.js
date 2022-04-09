import { getObjectsByPrototype } from "game/utils";
import { CostMatrix } from "game/path-finder";


function getRectangleArea(x1, y1, x2, y2) {
  let area = [];
  for (let i = x1; i <= x2; i++) {
    for (let j = y1; j <= y2; j++) {
      area.push({ x: i, y: j });
    }
  }
  return area;

}


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



