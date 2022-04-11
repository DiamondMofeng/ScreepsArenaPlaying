

import { importAll } from './importAll'
importAll()

import { getBoundaryCoordinate, getRectangleArea, getSquardArea } from './helper'
import { Visual } from './makeVisualGreatAgain'



/**
 * 0,0到99,99
 */


/**
 * 获取对应creep数组的伤害map
 * @param {Array} creeps 
 * @returns 
 */
export function DamageMap(creeps) {

  let map = new Array(100).fill(new Array(100).fill(0))


  for (let c of creeps) {

    let RAs = c.body.filter(b => b.type == RANGED_ATTACK).length
    let As = c.body.filter(b => b.type == ATTACK).length

    //对于Attack:视为两格以内满额伤害
    //对于RangedAttack:视为伤害范围+1

    //处理Attack  
    if (As.length > 0) {
      for (let pos of getSquardArea(c.x, c.y, 2)) {
        map[pos.x][pos.y] += As * 30
      }
    }
    //处理RangedAttack
    if (RAs.length > 0) {
      for (let pos of getSquardArea(c.x, c.y, 4)) {
        map[pos.x][pos.y] += RAs * 10
      }
    }

  }
  return map

}

/**
 * 获取对应creep数组的治疗map
 * @param {Array} creeps 
 * @returns 
 */
export function HealMap(creeps) {

  let map = new Array(100).fill(new Array(100).fill(0))

  for (let c of creeps) {

    let Hs = c.body.filter(b => b.type == HEAL).length
    //Heal不做范围扩大处理
    if (Hs > 0) {
      console.log('H: ', Hs);
      console.log('getSquardArea(c.x, c.y, 3: ', getSquardArea(c.x, c.y, 3))
      console.log('getSquardArea(c.x, c.y, 1): ', getSquardArea(c.x, c.y, 1));

      for (let pos of getSquardArea(c.x, c.y, 3)) {
        console.log('pos: ', pos);
        map[pos.x][pos.y] += Hs * 4
      }
      for (let pos of getSquardArea(c.x, c.y, 1)) {
        map[pos.x][pos.y] += Hs * 8
      }

    }


  }
  return map

}

export function showMap(map, style) {
  console.log('map: ', map);
  style = { ...style, font: "0.7" }

  let v = new Visual()
  for (let x = 0; x < 100; x++) {
    for (let y = 0; y < 100; y++) {
      if (map[x][y] > 0) {
        // console.log('{ x, y }: ', { x, y });
        v.text(map[x][y], { x, y }, style)
      }
    }
  }

}



const InfoMap = {
  DamageMap,
  HealMap,
  showMap
}
export default InfoMap

