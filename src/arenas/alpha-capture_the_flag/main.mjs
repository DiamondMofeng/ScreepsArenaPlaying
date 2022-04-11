import { } from '/game/utils';
import { } from '/game/prototypes';
import { } from '/game/constants';
import { } from '/arena';

/*
第一版代码：无视掉落的body,直接打团
*/


export function loop() {
    // Your code goes here
    let creeps = getObjectsByPrototype(Creep).filter(c => c.my);
    let enemyCreeps = getObjectsByPrototype(Creep).filter(c => !c.my);

    let myTowers = getObjectsByPrototype(StructureTower).filter(t => t.my);
    let enemyTowers = getObjectsByPrototype(StructureTower).filter(t => !t.my);

    






}
