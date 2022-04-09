import { getObjectsByPrototype } from '/game/utils';
import { StructureSpawn } from '/game/prototypes';
import { MOVE } from '/game/constants';

var creep1, creep2;

export function loop() {
  var spawns = getObjectsByPrototype(StructureSpawn)[0];
  // console.log(JSON.stringify)
  // console.log('getObjectsByPrototype: ', getObjectsByPrototype.toLocaleString());
  // console.log('StructureSpawn: ', StructureSpawn);
  // console.log('StructureSpawn.spawnCreep', JSON.stringify(spawns.spawnCreep.toLocaleString()))
  // console.log(getObjectsByPrototype)
  console.log(spawns.spawning)
}
