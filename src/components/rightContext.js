
import rightMenu from "./rightMenu.vue"

const install = function (Vue) {
  let oldInstance = null;
  const rightCxtCtr = Vue.extend(rightMenu)
  /**
   * @param options.menu 右键的菜单选项
   * @param options.event 右键点击事件
   * @param options.posX 如果不传event对象，则需要指定X坐标
   * @param options.posY 如果不传event对象，则需要指定Y坐标
   * @param options.canClickFather 点击父级节点是否也触发事件
   * @param options.canHoverOut 鼠标是否可以悬浮在ctxmenu之外
   * @param options.backgroundColor 背景色
   * @param options.activeColor 弹窗悬浮颜色
   * @param options.nowBoxWidth 顶级弹窗的宽度
   */
  const rightCxtFn = function (options) {
    return new Promise((resolve, reject) => {
      const instance = new rightCxtCtr()
      instance.menu = options.menu
      instance.canClickFather = options.canClickFather; // 点击父级节点是否也触发事件
      instance.canHoverOut = options.canHoverOut; // 鼠标是否可以悬浮在ctxmenu之外
      instance.backgroundColor = options.backgroundColor || "#fff"; // 弹窗背景色
      instance.activeColor = options.activeColor || "#f2f2f2"; // 弹窗悬浮颜色
      // 处理X, Y坐标
      instance.posX = (options.event && options.event.clientX) || options.posX || 0;
      instance.absoluteX = instance.posX;
      instance.posY = (options.event && options.event.clientY) || options.posY || 0;

      instance.nowBoxWidth = options.nowBoxWidth || 200; // 当前节点的宽度，不写则为200
      instance.needReverse = instance.posX + instance.nowBoxWidth > document.body.clientWidth - 5

      if (instance.needReverse) {
        instance.posX = instance.posX - instance.nowBoxWidth
      }
      oldInstance = instance
      instance.topEmitClick = (data) => {
        resolve(data)
      }
      instance.topEmitCancel = (data) => {
        reject(data)
      }
      rightCxtFn.destroy()
      instance.$mount()
      document.body.appendChild(instance.$el)
    })
  }
  rightCxtFn.destroy = () => {
    if (oldInstance) {
      oldInstance.$destroy()
      if (oldInstance.$el && oldInstance.$el.className) {
        const oldClassName = `.${oldInstance.$el.className.replace(" ", ".")}`
        if (document.querySelectorAll(oldClassName).length) {
          document.body.removeChild(oldInstance.$el)
        }
      }
      oldInstance = null
    }
  }
  Vue.prototype.$rightCtx = rightCxtFn
}

export default {
  install
}