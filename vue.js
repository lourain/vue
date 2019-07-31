
class Vue {
    constructor(option = {}) {
        this.$el = option.el
        this.$data = option.data
        this.$methods = option.methods
        
        this.proxy(this.$data)
        this.proxy(this.$methods)
       
        //劫持数据
        new Observe(this.$data)
        if (this.$el) {
            //解析模板
            new Compile(this.$el,this)
        }
    }

    proxy(data) {
        if(typeof data !== 'object') return  
        Object.keys(data).forEach((key)=>{
                Object.defineProperty(this,key,{
                    configurable:true,
                    enumerable:true,
                    get() {
                        return data[key]
                    },
                    set(newvalue) {
                        data[key] = newvalue
                    }
                })
        })
    }

}