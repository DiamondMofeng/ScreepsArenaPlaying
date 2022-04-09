
function spawnCreep(body) {
  if (!this.my) {
    return returnError(C.ERR_NOT_OWNER);
  }

  if (SystemStore.roomObjectsData[this.id].spawning) {
    return returnError(C.ERR_BUSY);
  }

  if (!body || !Array.isArray(body) || body.length === 0 || body.length > C.MAX_CREEP_SIZE) {
    return returnError(C.ERR_INVALID_ARGS);
  }

  for (let i = 0; i < body.length; i++) {
    if (!C.BODYPART_COST[body[i]]) {
      return returnError(C.ERR_INVALID_ARGS);
    }
  }

  const energyAvailable = Object.values(SystemStore.roomObjectsData).filter(i =>
    i.user === SystemStore.roomObjectsData[this.id].user && i.type == 'spawn' || i.type == 'extension')
    .reduce((sum, i) => sum + (i.store.energy || 0), 0);
  if (energyAvailable < body.reduce((sum, i) => sum + C.BODYPART_COST[i], 0)) {
    return returnError(C.ERR_NOT_ENOUGH_ENERGY);
  }

  let object = new Creep();
  Intents.set(this.id, 'spawnCreep', { body, createRequest: getCreateRequest(object) });
  if (SystemStore.codeCreatedAt > breakingChanges.returnCompositeObject) {
    return { object };
  }
  else {
    return object;
  }
}
