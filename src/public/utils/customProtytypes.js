import { getTicks } from 'game/utils'
import { StructureSpawn } from 'game/prototypes'

import { ERR_BUSY, OK, HEAL, MAX_CREEP_SIZE } from 'game/constants'




Object.defineProperties(StructureSpawn.prototype, {

  safeSpawn: {
    value: function (...args) {
      //检查这一tick是否已spawn过
      if (!this.lastSpawn) {
        this.lastSpawn = -1
      }
      if (this.lastSpawn == getTicks()) {
        return ERR_BUSY
      }

      let result = this.spawnCreep(...args)
      if (result == OK) {
        this.lastSpawn = getTicks()
      }

      return result
    }
  },
  spawning: {
    get: function () {
      return this.spawnCreep(body([HEAL, MAX_CREEP_SIZE])) === ERR_BUSY
    }
  }
})
