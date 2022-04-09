import { findClosestByPath, getObjectsByPrototype, getRange, findPath } from 'game/utils';
import { Creep, Source, StructureContainer, StructureSpawn } from 'game/prototypes';
import { RESOURCE_ENERGY, WORK, CARRY, MOVE, ATTACK, RANGED_ATTACK, HEAL, ERR_NOT_IN_RANGE } from 'game/constants';

import beheaviors from '../utils/beheaviors'

const { moveAndTransfer, moveAndWithdraw, moveAndAttack, moveAndRA, moveAndHeal
  , workingStatesKeeper } = beheaviors

/*
造一个人体蜈蚣
*/
const BODY_WUGONG = [CARRY, CARRY, MOVE]
// let flag = false

//写在外面 以跨tick
//用于存放蜈蚣creep
const wugong = []

const start = () => {


  //! 临时 
  let creeps = getObjectsByPrototype(Creep)

  //获取spawn到container的距离


  let spawn = getObjectsByPrototype(StructureSpawn).find(s => s.my)
  let container = getObjectsByPrototype(StructureContainer)
    .find(c => c.store.energy > 0 && getRange(spawn, c) <= 5)

  if (!container) return true//todo 解决初始资源耗尽后的问题

  let distance = getRange(spawn, container) - 1

  if (wugong.length < distance) {

    let newCreep = spawn.spawnCreep(BODY_WUGONG)
    // console.log('newCreep: ', newCreep);
    if (!newCreep.error
      // && newCreep.object
      // && newCreep.object.id
    ) {
      wugong.push(newCreep.object)
    }

  }
  // console.log('getWugong', wugong);

  //控制wugong

  if (wugong.length < distance ||
    wugong.length == distance && wugong[wugong.length - 1]?.x == spawn.x && wugong[wugong.length - 1]?.y == spawn.y) {

    for (let i = 0; i < wugong.length; i++) {
      if (!wugong[i].store) continue;

      workingStatesKeeper(wugong[i],
        () => moveAndWithdraw(wugong[i], container),
        () => moveAndTransfer(wugong[i], spawn))


    }

    return false  //!
  }

  else {
    //组成人体蜈蚣
    if (!wugong[wugong.length - 1].store) {
      return false
    }
    let path = findPath(spawn, container, { ignore: creeps, range: 1 })


    //移动到对应位置
    for (let i = 0; i < path.length; i++) {
      wugong[i].moveTo(path[i])



    }

    //按顺序将能量传给下一位
    wugong[wugong.length - 1].withdraw(container, 'energy')
    for (let i = wugong.length - 1; i > 0; i--) {
      // 
      wugong[i].transfer(wugong[i - 1], 'energy')
    }
    wugong[0].transfer(spawn, 'energy')
    //头尾输送能量
    //头为0，最靠近spawn的
    //尾为最后一位，负责拿取container能量

    return true //!
  }

}


export default start
