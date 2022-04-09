import { getObjectsByPrototype, findClosestByRange } from 'game/utils'
import { Creep, StructureSpawn } from 'game/prototypes'

import { avoidTouch } from '../utils/costMartix';

//changed
//最初始的，不考虑连携
//默认此creep有heal和rangedAttack部件

import beheaviors from '../utils/beheaviors';

/**
 * 
 * @param {Creep} creep 
 */
export function single(creep, target = undefined) {

  creep.heal(creep)
  let enemyCreeps = getObjectsByPrototype(Creep).filter(c => !c.my);

  if (!target) {
    if (enemyCreeps.length > 0) {
      target = findClosestByRange(creep, enemyCreeps)
    }
    else {
      target = getObjectsByPrototype(StructureSpawn).find(s => !s.my);
    }
  }




  beheaviors.RA(creep, target)
  beheaviors.kite(creep, target, 3,{ costMatrix: avoidTouch(enemyCreeps) })
  // console.log('avoidTouch(enemyCreeps): ', avoidTouch(enemyCreeps));


}