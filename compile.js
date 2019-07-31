/**
 * 解析模板
 * @param el 模板
 * @param vm vue实例
 */
class Compile {
    constructor(el, vm) {
        this.el = typeof el === 'string' ? document.querySelector(el) : el;
        this.vm = vm
        //1.把el内节点加入到内存中fragment
        let fragment = this.node2Fragment(this.el)
        
        //2.对el插值解析
        //3.把fragment添加到页面内\
        this.el.appendChild(fragment)
    }
    node2Fragment(node) {
        
        let fragment = document.createDocumentFragment()
        //将节点信息处理一遍，再塞入fragment
        this.compile(node)
        this.toArray(node.childNodes).forEach(n=>{
            fragment.appendChild(n)
        })
        return fragment

    }

    /* 工具方法 */
    toArray(likeArr) {
        return [].slice.call(likeArr)
    }
    isElementNode(node) {
        return node.nodeType === 1
    }
    isTextNode(node) {
        return node.nodeType === 3
    }
    isDirector(attr) {
        if (attr.startsWith('v-')) {
            return true
        }
    }
    isEventDirector(type){
        return type.split(':')[0] == 'v-on'
    }
    compileElement(node) {
        let attrs = node.attributes
        this.toArray(attrs).forEach(attr => {
            let attrName = attr.name
            let expr = attr.value
            if (this.isDirector(attrName)) {
                let type = attrName.slice(2)  
                CompileUtils[type] && CompileUtils[type](this.vm,node,expr)
            }

            if(this.isEventDirector(attrName)){
                CompileUtils['eventHandler'](this.vm,node,expr,attrName)
            }

        });


    }
    compileText(node) {
        
        CompileUtils.mustache(this.vm,node)
    }
   
    compile(node) {
        let childrens = this.toArray(node.childNodes)
        childrens.forEach(child => {
            if (this.isElementNode(child)) {
                this.compileElement(child)

            }
            if (this.isTextNode(child)) {
                this.compileText(child)
            }
            //如果元素节点下面还有子节点，则继续解析
            if (child.childNodes.length > 0) {
                this.compile(child)
            }
        })
    
    }
}

let CompileUtils = {
    mustache(vm,node) {
        let txt =  node.textContent
        let reg = /\{\{(.+)\}\}/

        if(reg.test(txt)){
            let expr = RegExp.$1
            node.textContent = txt.replace(reg,this.getVMvalue(vm,expr))
            //订阅事件，将observer与compile联系起来
            new Watcher(vm,expr,(newValue)=>{
                node.textContent = txt.replace(reg,this.getVMvalue(vm,expr))
                
            })
        }
    },
    text(vm,node,expr) {  
        node.textContent = this.getVMvalue(vm,expr)
        //订阅事件，将observer与compile联系起来
        // new Watcher(vm,expr,(newValue)=>{
        //     node.textContent = newValue
            
        // })
    },
    model(vm,node,expr) {
        node.value = this.getVMvalue(vm,expr)
        //订阅事件，将observer与compile联系起来
        node.addEventListener('input',function(){
            // vm.$data[expr] = this.value
            CompileUtils.setVMvalue(vm,expr,this.value)
            // node.value = v.data
        })
        // new Watcher(vm,expr,(newValue)=>{
        //     node.value = this.getVMvalue(vm,expr)
            
        // })
    },
    eventHandler(vm,node,expr,event) {
        var event = event.split(':')[1]
        vm.$methods && vm.$methods[expr] && node.addEventListener(event,vm.$methods[expr].bind(vm))
    },
    //获取vm内数据
    getVMvalue(vm,expr) {
        let data = vm.$data
        expr.split('.').forEach((key)=>{
           data = data[key]
        })
        return data
    },
    setVMvalue(vm,expr,value) {
        // debugger
        let data = vm.$data
        let expr_arr = expr.split('.')
        expr_arr.forEach((key,index)=>{
            if(index == expr_arr.length-1){
                data[key] = value                
            }else{
                data = data[key]
            }
        })
    }
}
