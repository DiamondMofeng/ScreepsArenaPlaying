import { } from '/arena';
import { findClosestByPath, getObjectsByPrototype } from 'game/utils';
import { Creep, Source, StructureSpawn } from 'game/prototypes';
import { RESOURCE_ENERGY, WORK, CARRY, MOVE, ATTACK, RANGED_ATTACK, HEAL, ERR_NOT_IN_RANGE } from 'game/constants';

export function loop() {
  let spawns = getObjectsByPrototype(StructureSpawn);
  let myCreeps = getObjectsByPrototype(Creep).filter(c => c.my);
  let enemyCreeps = getObjectsByPrototype(Creep).filter(c => !c.my);

  let sources = getObjectsByPrototype(Source).filter(s => s.energy > 0);



  let workCreeps = myCreeps.filter(c => c.body.some(b => b.type == WORK));
  let attackCreeps = myCreeps.filter(c => c.body.some(b => b.type == ATTACK));
  let rangedAttackCreeps = myCreeps.filter(c => c.body.some(b => b.type == RANGED_ATTACK));
  let healCreeps = myCreeps.filter(c => c.body.some(b => b.type == HEAL));

  let body_workers = [WORK, CARRY, MOVE];
  let body_attackers = [ATTACK, MOVE];
  let body_rangedAttackers = [RANGED_ATTACK, MOVE];
  let body_healers = [HEAL, MOVE];




  for (let spawn of spawns) {

    if (spawn.spawning) {
      continue;
    }

    if (workCreeps.length < 3) {
      spawn.spawnCreep(body_workers);
      if (attackCreeps.length < 1) {
        spawn.spawnCreep(body_attackers);
      }
      if (rangedAttackCreeps.length < 1) {
        spawn.spawnCreep(body_rangedAttackers);
      }
      if (healCreeps.length < 1) {
        spawn.spawnCreep(body_healers);
      }
    }
  }

  for (let creep of workCreeps) {

    if (creep.store[RESOURCE_ENERGY] < creep.store.getCapacity()) {
      let source = findClosestByPath(sources)
      if (creep.harvest(source)) {
        creep.moveTo(source);
      }
    }

    else {

      let emptySpawn = findClosestByPath(spawns.filter(s => s.energy < s.energyCapacity));
      if (emptySpawn) {
        if (creep.transfer(emptySpawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(emptySpawn);
        }
      }

    }

  }

  for (let creep of attackCreeps) {
    let enemy = creep.findClosestByPath(enemyCreeps);
    if (creep.attack(enemy) == ERR_NOT_IN_RANGE) {
      creep.moveTo(enemy);
    }
  }

  for (let creep of healCreeps) {
    let damagedCreep = creep.findClosestByPath(myCreeps.filter(c => c.hits < c.hitsMax));
    if (creep.heal(damagedCreep) == ERR_NOT_IN_RANGE) {
      creep.moveTo(damagedCreep);
    }
  }


  for (let creep of rangedAttackCreeps) {
    let enemy = creep.findClosestByPath(enemyCreeps);
    if (creep.rangedAttack(enemy) == ERR_NOT_IN_RANGE) {
      creep.moveTo(enemy);
    }
  }








}