import { importAll } from "./public/utils/importAll";
importAll()
import InfoMap, { showMap } from "./public/utils/infoMap";
// import { tst } from './test'

export function loop() {

  let enemies = getObjectsByPrototype(Creep).filter(c => !c.my);

  // let enemyDamageMap = InfoMap.DamageMap(enemies)
  let enemyHealMap = InfoMap.HealMap(enemies)
  

  // showMap(enemyDamageMap, { color: '#ff0000' })
  showMap(enemyHealMap, { color: '#00ff00' })
}
