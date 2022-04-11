class Creep extends GameObject {

  get hits() {
    if (!this.exists) {
      return;
    }
    return SystemStore.roomObjectsData[this.id].hits;
  }

  get hitsMax() {
    if (!this.exists) {
      return;
    }
    return SystemStore.roomObjectsData[this.id].hitsMax;
  }

  get my() {
    if (!this.exists) {
      return;
    }
    return SystemStore.roomObjectsData[this.id].user === SystemStore.playerName;
  }

  get fatigue() {
    if (!this.exists) {
      return;
    }
    return SystemStore.roomObjectsData[this.id].fatigue;
  }

  get body() {
    if (!this.exists) {
      return;
    }
    return SystemStore.roomObjectsData[this.id].body;
  }

  get store() {
    if (!this.exists) {
      return;
    }
    return new Store(SystemStore.roomObjectsData[this.id]);
  }

  toJSON() {
    return Object.assign(super.toJSON(), {
      hits: this.hits,
      hitsMax: this.hitsMax,
      my: this.my,
      fatigue: this.fatigue,
      body: this.body,
      store: this.store
    })
  }

  move(direction) {
    if (!this.exists) {
      return;
    }
    if (!this.my) {
      return C.ERR_NOT_OWNER;
    }
    Intents.set(this.id, 'move', { direction });
    return C.OK;
  }

  moveTo(x, y, opts) {
    if (typeof x === 'object') {
      if (!x) {
        return;
      }
      opts = y;
      y = x.y;
      x = x.x;
    }
    const path = this.findPathTo({ x, y }, opts);
    if (path.length > 0) {
      let direction = getDirection(path[0].x - this.x, path[0].y - this.y);
      return this.move(direction);
    }
  }

  rangedAttack(target) {
    if (!this.exists) {
      return;
    }

    if (!this.my) {
      return C.ERR_NOT_OWNER;
    }

    if (!target || !target.exists || !(target instanceof GameObject)) {
      return C.ERR_INVALID_TARGET;
    }

    if (!this.body.some(p => p.type === C.RANGED_ATTACK && p.hits > 0)) {
      return C.ERR_NO_BODYPART;
    }

    if (getDistance(this, target) > 3) {
      return C.ERR_NOT_IN_RANGE;
    }

    Intents.set(this.id, 'rangedAttack', { id: target.id });
    return C.OK;
  }

  rangedMassAttack() {
    if (!this.exists) {
      return;
    }

    if (!this.my) {
      return C.ERR_NOT_OWNER;
    }

    if (!this.body.some(p => p.type === C.RANGED_ATTACK && p.hits > 0)) {
      return C.ERR_NO_BODYPART;
    }

    Intents.set(this.id, 'rangedMassAttack', {});
    return C.OK;
  }

  attack(target) {
    if (!this.exists) {
      return;
    }

    if (!this.my) {
      return C.ERR_NOT_OWNER;
    }

    if (!target || !target.exists || !(target instanceof GameObject)) {
      return C.ERR_INVALID_TARGET;
    }

    if (!this.body.some(p => p.type === C.ATTACK && p.hits > 0)) {
      return C.ERR_NO_BODYPART;
    }

    if (getDistance(this, target) > 1) {
      return C.ERR_NOT_IN_RANGE;
    }

    Intents.set(this.id, 'attack', { id: target.id });
    return C.OK;
  }

  heal(target) {
    if (!this.exists) {
      return;
    }

    if (!this.my) {
      return C.ERR_NOT_OWNER;
    }

    if (!target || !target.exists || !(target instanceof GameObject)) {
      return C.ERR_INVALID_TARGET;
    }

    if (!this.body.some(p => p.type === C.HEAL && p.hits > 0)) {
      return C.ERR_NO_BODYPART;
    }

    if (getDistance(this, target) > 1) {
      return C.ERR_NOT_IN_RANGE;
    }

    Intents.set(this.id, 'heal', { id: target.id });
    return C.OK;
  }

  rangedHeal(target) {
    if (!this.exists) {
      return;
    }

    if (!this.my) {
      return C.ERR_NOT_OWNER;
    }

    if (!target || !target.exists || !(target instanceof GameObject)) {
      return C.ERR_INVALID_TARGET;
    }

    if (!this.body.some(p => p.type === C.HEAL && p.hits > 0)) {
      return C.ERR_NO_BODYPART;
    }

    if (getDistance(this, target) > 3) {
      return C.ERR_NOT_IN_RANGE;
    }

    Intents.set(this.id, 'rangedHeal', { id: target.id });
    return C.OK;
  }


  pull(target) {
    if (!this.exists) {
      return;
    }

    if (!this.my) {
      return C.ERR_NOT_OWNER;
    }

    if (!target || !target.exists || !(target instanceof Creep)) {
      return C.ERR_INVALID_TARGET;
    }

    Intents.set(this.id, 'pull', { id: target.id });
    return C.OK;
  }

  withdraw(target, resourceType, amount) {
    if (!this.exists) {
      return;
    }

    if (!this.my) {
      return C.ERR_NOT_OWNER;
    }
    if (this.spawning) {
      return C.ERR_BUSY;
    }
    if (amount < 0) {
      return C.ERR_INVALID_ARGS;
    }
    if (!C.RESOURCES_ALL.includes(resourceType)) {
      return C.ERR_INVALID_ARGS;
    }

    if (!target || !target.id || !SystemStore.roomObjectsData[target.id].store || !(target instanceof Structure)) {
      return C.ERR_INVALID_TARGET;
    }

    if (!capacityForResource(SystemStore.roomObjectsData[target.id], resourceType) && !SystemStore.roomObjectsData[target.id].store[resourceType]) {
      return C.ERR_INVALID_TARGET;
    }

    if (this.getRangeTo(target) > 1) {
      return C.ERR_NOT_IN_RANGE;
    }

    const emptySpace = SystemStore.roomObjectsData[this.id].storeCapacity - sumObjectValues(SystemStore.roomObjectsData[this.id].store);

    if (emptySpace <= 0) {
      return C.ERR_FULL;
    }

    if (!amount) {
      amount = Math.min(emptySpace, SystemStore.roomObjectsData[target.id].store[resourceType]);
    }

    if (amount > emptySpace) {
      return C.ERR_FULL;
    }

    if (!amount || (SystemStore.roomObjectsData[target.id].store[resourceType] || 0) < amount) {
      return C.ERR_NOT_ENOUGH_RESOURCES;
    }

    Intents.set(this.id, 'withdraw', { id: target.id, amount, resourceType });
    return C.OK;
  }

  transfer(target, resourceType, amount) {
    if (!this.exists) {
      return;
    }
    if (!this.my) {
      return C.ERR_NOT_OWNER;
    }
    if (this.spawning) {
      return C.ERR_BUSY;
    }
    if (amount < 0) {
      return C.ERR_INVALID_ARGS;
    }
    if (!C.RESOURCES_ALL.includes(resourceType)) {
      return C.ERR_INVALID_ARGS;
    }
    if (!target ||
      !target.id ||
      !SystemStore.roomObjectsData[target.id].store ||
      ((target instanceof Creep) && target.spawning) ||
      !(target instanceof Structure) && !(target instanceof Creep)) {
      return C.ERR_INVALID_TARGET;
    }

    if (!capacityForResource(SystemStore.roomObjectsData[target.id], resourceType)) {
      return C.ERR_INVALID_TARGET;
    }

    if (this.getRangeTo(target) > 1) {
      return C.ERR_NOT_IN_RANGE;
    }
    if (!SystemStore.roomObjectsData[this.id].store || !SystemStore.roomObjectsData[this.id].store[resourceType]) {
      return C.ERR_NOT_ENOUGH_RESOURCES;
    }

    const storedAmount = SystemStore.roomObjectsData[target.id].storeCapacityResource ? SystemStore.roomObjectsData[target.id].store[resourceType] || 0 : sumObjectValues(SystemStore.roomObjectsData[target.id].store);
    const targetCapacity = capacityForResource(SystemStore.roomObjectsData[target.id], resourceType);

    if (!SystemStore.roomObjectsData[target.id].store || storedAmount >= targetCapacity) {
      return C.ERR_FULL;
    }

    if (!amount) {
      amount = Math.min(SystemStore.roomObjectsData[this.id].store[resourceType], targetCapacity - storedAmount);
    }

    if (SystemStore.roomObjectsData[this.id].store[resourceType] < amount) {
      return C.ERR_NOT_ENOUGH_RESOURCES;
    }

    if ((amount + storedAmount) > targetCapacity) {
      return C.ERR_FULL;
    }

    Intents.set(this.id, 'transfer', { id: target.id, amount, resourceType });
    return C.OK;
  }

  harvest(target) {
    if (!this.exists) {
      return;
    }

    if (!this.my) {
      return C.ERR_NOT_OWNER;
    }
    if (this.spawning) {
      return C.ERR_BUSY;
    }
    if (!this.body.some(p => p.type === C.WORK && p.hits > 0)) {
      return C.ERR_NO_BODYPART;
    }
    if (!target || !target.id || !(target instanceof Source)) {
      return C.ERR_INVALID_TARGET;
    }

    if (!target.energy) {
      return C.ERR_NOT_ENOUGH_RESOURCES;
    }
    if (this.getRangeTo(target) > 1) {
      return C.ERR_NOT_IN_RANGE;
    }

    Intents.set(this.id, 'harvest', { id: target.id });
    return C.OK;
  }

  drop(resourceType, amount) {
    if (!this.exists) {
      return;
    }
    if (!this.my) {
      return C.ERR_NOT_OWNER;
    }
    if (this.spawning) {
      return C.ERR_BUSY;
    }
    if (!C.RESOURCES_ALL.includes(resourceType)) {
      return C.ERR_INVALID_ARGS;
    }
    if (!SystemStore.roomObjectsData[this.id].store || !SystemStore.roomObjectsData[this.id].store[resourceType]) {
      return C.ERR_NOT_ENOUGH_RESOURCES;
    }
    if (!amount) {
      amount = SystemStore.roomObjectsData[this.id].store[resourceType];
    }
    if (SystemStore.roomObjectsData[this.id].store[resourceType] < amount) {
      return C.ERR_NOT_ENOUGH_RESOURCES;
    }

    Intents.set(this.id, 'drop', { amount, resourceType });
    return C.OK;
  }

  pickup(target) {
    if (!this.exists) {
      return;
    }

    if (!this.my) {
      return C.ERR_NOT_OWNER;
    }
    if (this.spawning) {
      return C.ERR_BUSY;
    }
    if (!target || !target.id || !(target instanceof Resource)) {
      return C.ERR_INVALID_TARGET;
    }
    if (sumObjectValues(SystemStore.roomObjectsData[this.id].store) >= SystemStore.roomObjectsData[this.id].storeCapacity) {
      return C.ERR_FULL;
    }
    if (this.getRangeTo(target) > 1) {
      return C.ERR_NOT_IN_RANGE;
    }

    Intents.set(this.id, 'pickup', { id: target.id });
    return C.OK;
  }

  build(target) {
    if (!this.exists) {
      return;
    }
    if (!this.my) {
      return C.ERR_NOT_OWNER;
    }
    if (this.spawning) {
      return C.ERR_BUSY;
    }
    if (!this.body.some(p => p.type === C.WORK && p.hits > 0)) {
      return C.ERR_NO_BODYPART;
    }
    if (!this.store.energy) {
      return C.ERR_NOT_ENOUGH_RESOURCES;
    }
    if (!target || !target.id || !(target instanceof ConstructionSite)) {
      return C.ERR_INVALID_TARGET;
    }
    if (this.getRangeTo(target) > 3) {
      return C.ERR_NOT_IN_RANGE;
    }

    const objectsInTile = [], creepsInTile = [];
    let rampart;

    for (const obj of Object.values(SystemStore.roomObjectsData)) {
      if (obj.x == target.x && obj.y == target.y) {
        if (obj.prototypeName == target.structurePrototypeName) {
          return C.ERR_INVALID_TARGET;
        }
        if (obj.type == 'rampart') {
          rampart = obj;
        }
        if (C.OBSTACLE_OBJECT_TYPES.includes(obj.type)) {
          if (obj.type == 'creep') {
            creepsInTile.push(obj);
          } else {
            objectsInTile.push(obj);
          }
        }
      }
    }
    if (rampart && rampart.user !== SystemStore.roomObjectsData[this.id].user) {
      return C.ERR_INVALID_TARGET;
    }
    if (C.OBSTACLE_OBJECT_TYPES.includes(C.STRUCTURE_PROTOTYPES[target.structurePrototypeName])) {
      if (objectsInTile.length > 0) {
        return C.ERR_INVALID_TARGET;
      }
      if (creepsInTile.length > 0) {
        return C.ERR_INVALID_TARGET;
      }
    }

    Intents.set(this.id, 'build', { id: target.id, x: target.x, y: target.y });
    return C.OK;
  }
}