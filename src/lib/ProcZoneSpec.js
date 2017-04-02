class ProcZoneSpec {
  constructor(name, proc, { handleFrame, handleError, handleIdle }) {
    this.name = name;
    this.properties = {
      proc,
    };
    this.handleFrame = handleFrame.bind(null);
    this.handleError = handleError.bind(null);
    this.handleIdle = handleIdle.bind(null);
  }

  onInvoke(
    parentZoneDelegate,
    currentZone,
    targetZone,
    delegate,
    applyThis,
    applysArgs,
    source,
  ) {
    const runFrame = () =>
      parentZoneDelegate.invoke(
        targetZone,
        delegate,
        applyThis,
        applysArgs,
        source,
      );
    this.handleFrame(runFrame);
  }

  onHandleError(parentZoneDelegate, currentZone, targetZone, err) {
    this.handleError(err);
  }

  onHasTask(delegate, current, target, hasTaskState) {
    if (!hasTaskState.microTask && !hasTaskState.macroTask) {
      this.handleIdle(hasTaskState);
    }
  }
}

export default ProcZoneSpec;
