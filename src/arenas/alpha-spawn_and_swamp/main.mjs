// import { findClosestByPath, getObjectsByPrototype, getRange } from 'game/utils';
// import { Creep, Source, StructureContainer, StructureSpawn } from 'game/prototypes';
// import { RESOURCE_ENERGY, WORK, CARRY, MOVE, ATTACK, TOUGH, RANGED_ATTACK, HEAL, ERR_NOT_IN_RANGE } from 'game/constants';

import { importAll } from './public/utils/importAll';
importAll();

import beheaviors from './public/utils/beheaviors';
import start from './public/test/begin';
import { body } from './public/utils/helper';

//! 临时
import { single } from './public/role/yitiji';


const body_workers = [WORK, CARRY, MOVE];
const body_attackers = [ATTACK, MOVE];
const body_rangedAttackers = [RANGED_ATTACK, MOVE];
const body_healers = [HEAL, MOVE];

const body_yitiji = body([TOUGH, 1, MOVE, 4, RANGED_ATTACK, 3, MOVE, 1, HEAL, 1])


export function loop() {
    let spawns = getObjectsByPrototype(StructureSpawn).filter(s => s.my);
    let myCreeps = getObjectsByPrototype(Creep).filter(c => c.my);

    let enemyCreeps = getObjectsByPrototype(Creep).filter(c => !c.my);
    let enemySpawn = getObjectsByPrototype(StructureSpawn).filter(s => !s.my);

    let sources = getObjectsByPrototype(Source).filter(s => s.energy > 0);
    let containers = getObjectsByPrototype(StructureContainer).filter(c => c.store.energy > 0);



    let workCreeps = myCreeps.filter(c => c.body.some(b => b.type == WORK));
    let attackCreeps = myCreeps.filter(c => c.body.some(b => b.type == ATTACK));
    let rangedAttackCreeps = myCreeps.filter(c => c.body.some(b => b.type == RANGED_ATTACK));
    let healCreeps = myCreeps.filter(c => c.body.some(b => b.type == HEAL));


    
    if (!start()) return



    for (let spawn of spawns) {

        // if (attackCreeps.length < 3) {
        //     spawn.spawnCreep(body_attackers);
        // } else {
        spawn.spawnCreep(body_yitiji);
        // }
        // spawn.spawnCreep(body_attackers);
        // }
        // if (rangedAttackCreeps.length < 1) {
        // spawn.spawnCreep(body_rangedAttackers);
        // // }
        // // if (healCreeps.length < 1) {
        // spawn.spawnCreep(body_healers);
        // // }

    }

    for (let creep of workCreeps) {

        if (creep.store[RESOURCE_ENERGY] < creep.store.getCapacity()) {
            let container = findClosestByPath(containers)
            if (container) {
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            }


            let source = findClosestByPath(sources)
            if (source) {
                if (creep.harvest(source)) {
                    creep.moveTo(source);
                }
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

        if (!enemy) {
            let enemySpawn = getObjectsByPrototype(StructureSpawn).find(s => !s.my);
            beheaviors.moveAndAttack(creep, enemySpawn);
        }
    }

    // for (let creep of healCreeps) {
    //     let damagedCreep = creep.findClosestByPath(myCreeps.filter(c => c.hits < c.hitsMax));
    //     if (creep.heal(damagedCreep) == ERR_NOT_IN_RANGE) {
    //         creep.moveTo(damagedCreep);
    //     }
    // }


    for (let creep of rangedAttackCreeps) {
        single(creep)
    }








}