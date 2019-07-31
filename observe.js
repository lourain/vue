
class Observe {
    constructor(data = {}) {
        this.data = data
        this.walk(this.data)
        
    }
    walk(data) {
        if(typeof data !== 'object'){
            return
        }
        let keys = Object.keys(data)
        keys.forEach(key => {
            if (typeof data[key] == 'object') {
                this.walk(data[key])
            } else {
                this.defineReactive(data, key, data[key])
            }
        })

    }
    defineReactive(data, key, value) {
        var that = this
       
        let dep = new Dep()
        Object.defineProperty(data, key, {
            configurable: true,
            enumerable: true,
            get() {
                //在compile中已经有被调用了，相当于载入就执行了
                console.log(`${key}被劫持了`);
                console.log(Dep.target);
                
                Dep.target && dep.addSub(Dep.target)

                return value
            },
            set(newVal) {
                value = newVal
                console.log(dep.subs);

                // that.walk(newVal)
                //触发通知、
                dep.notify()
                // window.watcher.update()
                
            }
        })
    }
}