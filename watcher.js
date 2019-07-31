//watcher用于关联observer和compile
class Watcher {
    constructor(vm, expr, cb) {
        this.vm = vm
        this.expr = expr
        this.cb = cb
        //把Dep与watch关联起来  把watch实例添加进去
        Dep.target = this
        //存储老值
        this.oldValue = this.getVMvalue(vm, expr)

    }
    //获取vm内数据
    getVMvalue(vm, expr) {
        let data = vm.$data
        expr.split('.').forEach((key) => {
            data = data[key]
        })
        return data
    }
   
    update() {
        let oldValue = this.oldValue
        let newValue = this.getVMvalue(this.vm,this.expr)
        if(newValue !== oldValue){
            this.cb(newValue,oldValue)
        }
    }
}


//建立订阅者模式 便于管理
class Dep {
    constructor(){
        this.subs = []
    }
    
    addSub(sub) {
        this.subs.push(sub)
        Dep.target = null
    }
    //通知触发 告诉订阅者
    notify() {
        this.subs.forEach(sub => {
            //执行sub内的update函数
            sub.update()
        });
    }
}

