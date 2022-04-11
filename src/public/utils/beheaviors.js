import { findClosestByPath, getObjectsByPrototype, getRange, findPath, getDirection } from 'game/utils';
import { Creep, Source, StructureContainer, StructureSpawn } from 'game/prototypes';
import { RESOURCE_ENERGY, WORK, CARRY, MOVE, ATTACK, RANGED_ATTACK, HEAL, ERR_NOT_IN_RANGE, ERR_BUSY } from 'game/constants';
import { body, getDirectionBetween, getOppoDir } from './helper';

const IGNORE_CREEPS = false

function moveAndAttack(creep, target) {
  if (creep.attack(target) == ERR_NOT_IN_RANGE) {
    creep.moveTo(target);
  }
  creep.moveTo(target)
}


/**
* 
* @param {Creep} creep 
* @param {*} target 
*/
function moveAndRA(creep, target) {
  let range = getRange(creep, target)
  if (range > 3) {
    creep.moveTo(target);
  } else if (range >= 2 && range <= 3) {
    creep.rangedAttack(target);
  } else {
    creep.rangedMassAttack()
  }

}

/**
 * 将creep身上的资源转移至指定container，未指定时转移所有资源
 * @param {Creep} creep 
 * @param {StructureContainer|StructureStore} container - transfer to
 * @param {Array} resourceTypes - 未指定时转移所有资源
 * 
 */
function moveAndTransfer(creep, container, resourceTypes = [], moveOpt = {}) {

  let moveResult
  let transferResult

  moveOpt.ignoreCreeps = moveOpt.ignoreCreeps || IGNORE_CREEPS
  //若给定类型了则按类型transfer
  if (resourceTypes.length > 0) {

    for (let rt of resourceTypes) {
      let transferResult = creep.transfer(container, rt)
      if (transferResult == ERR_NOT_IN_RANGE) {
        creep.moveTo(container, { ...moveOpt, reusePath: 50 })
        return transferResult
      }
    }

  } else {

    for (let rt in creep.store) {

      transferResult = creep.transfer(container, rt)

      // console.log(transferResult)

      if (transferResult == ERR_NOT_IN_RANGE) {
        creep.moveTo(container, { ...moveOpt, reusePath: 50 })
        return transferResult
      }
    }
  }
}

/**
 * 默认只取能量
 * @param {Creep} creep 
 * @param {StructureContainer|STRUCTURE_STORAGE} container - withdraw from
 * @param {Array} resourceTypes an array
 */
function moveAndWithdraw(creep, container, resourceTypes = ['energy'], amount) {
  for (let rt of resourceTypes) {

    var withdrawResult = creep.withdraw(container, rt, amount)
    // console.log('withdrawResult', rt, withdrawResult)

    if (withdrawResult == ERR_NOT_IN_RANGE) {
      creep.moveTo(container, { reusePath: 50, ignoreCreeps: IGNORE_CREEPS })
      return withdrawResult
    }


  }
  return withdrawResult
}

function moveAndHeal(creep, target) {
  if (creep.heal(target) == ERR_NOT_IN_RANGE) {
    creep.moveTo(target);
  }
}

/**
 * 赋予creep工作状态属性: 以确保 收集能量至满背包，工作至能量清空
 * @notice 不需要给这两个函数传参数
 * @param {Creep} creep 
 * @param {Function} onCharge - 收集能量时的脚本函数
 * @param {Function} onWork  - 工作时的脚本函数
 */
function workingStatesKeeper(creep, onCharge, onWork, resourceType = 'energy') {

  if (!creep.store) return

  //若能量为空，置为获取能量状态

  if (creep.store.getUsedCapacity(resourceType) == 0) {
    onCharge()
  }

  //若能量为满，置为工作状态
  if (creep.store.getFreeCapacity(resourceType) == 0) {
    onWork()
  }



}

/**
 * 
 * @param {Creep} creep 
 * @param {*} target 
 */
function RA(creep, target) {
  let range = getRange(creep, target)
  if (range > 3) {
    return
  } else if (range >= 2 && range <= 3) {
    creep.rangedAttack(target);
  } else {
    creep.rangedMassAttack()
  }
}

/**
 * 放风筝，保持距离为range
 * @param {Creep} creep 
 * @param {Array} targets 
 * @param {Number} range - 保持风筝的距离
 * @param {Object} opt - 用于寻路的设置
 */
function kite(creep, targets, range = 3, opt = {}) {
  //初始化opt
  opt.range = opt.range || range
  // opt.ignoreCreeps = opt.ignoreCreeps || IGNORE_CREEPS
  opt.flee = opt.flee || true
  opt.costMatrix = opt.costMatrix || undefined



  let distance = getRange(creep, targets)
  //若距离相同则等待
  if (distance == range) return
  //若距离过小则flee
  if (distance < range) {
    let fleePath = findPath(creep, targets, opt)
    console.log('fleePath: ', fleePath);
    if (fleePath.length > 0) {
      creep.moveTo(fleePath[0])
    }
    else {//解决默认flee被贴脸后卡住的情况
      let curDir = getDirectionBetween(creep, targets)
      console.log('curDir: ', curDir);
      let oppoDir = getOppoDir(curDir)
      console.log('oppoDir: ', oppoDir);
      creep.move(oppoDir)
    }
  }
  //若距离过大则靠近
  else {
    creep.moveTo(targets)
  }
}

/**
 * 
 * @param {StructureSpawn} spawn 
 */
function isSpawning(spawn) {
  let res = spawn.spawnCreep(body([HEAL, 50])).error
  return res == ERR_BUSY
}








const beheaviors =
{
  moveAndAttack, moveAndRA, moveAndTransfer, moveAndWithdraw, moveAndHeal,
  RA, kite,
  workingStatesKeeper,
  isSpawning,

}



export default beheaviors