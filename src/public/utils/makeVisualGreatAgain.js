import * as VisualFun from '/game/visual';
// εε ππ persistent ε layerι½ζ―εη
export class Visual{
    persistent=false
    layer=0
    constructor(lay,per) {
        this.layer=lay
        this.persistent=!!per
    }
    circle(...args){
        VisualFun.circle(...args)
        return this;
    }
    clear(...args){
        VisualFun.clear(...args)
        return this;
    }
    line(...args){
        VisualFun.line(...args)
        return this;
    }
    poly(...args){
        VisualFun.poly(...args)
        return this;
    }
    rect(...args){
        VisualFun.rect(...args)
        return this;
    }
    text(...args){
        VisualFun.text(...args)
        return this;
    }
    size(...args){
        VisualFun.size(...args)
        return this;
    }
    exportString(){
        return VisualFun.exportString();
    }
    importString(...args){
        return VisualFun.importString(...args)
    }
}