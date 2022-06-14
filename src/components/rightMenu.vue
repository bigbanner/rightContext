<template>
  <transition :name="isTop?'fade':'leftin'">
    <ul
      class="ctx-menu-out"
      :style="compstyle + `width: ${isTop?nowBoxWidth:''}px;`"
      :class="{'top': isTop}"
      v-if="!isDestoryed"
      @contextmenu="handleContextmenu"
      ref="menuout"
    >
      <!-- 每个右侧菜单的选项 -->
      <li
        class="ctx-menu-item"
        :class="{'active': activeIndex === item.key}"
        :style="activeIndex === item.key?`background-color: ${activeColor};`:''"
        v-for="(item, index) in menu"
        :key="item.key"
        @mouseover="($event)=>handleMouseover($event, item, index)"
        @click="($event)=>handleClick(item, $event)"
      >
        <img :src="item.img" alt="logo" class="itemlogo" v-if="hasImg" :style="`visibility: ${item.img?'':'hidden'}`" />
        <!-- <span class="logobox"></span> -->
        <span class="labelbox">{{item.label}}</span>
        <template v-if="item.children">
          <!-- 是否有子菜单 -->
          <svg
            class="svgright"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="17235"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="24"
            height="24"
          >
            <path
              d="M332.032 171.008a28.8 28.8 0 0 0 8.96 20.992l312 320-312 320a28.8 28.8 0 0 0-8.96 20.992 28.8 28.8 0 0 0 8.96 20.992 28.8 28.8 0 0 0 20.992 8.96 30.592 30.592 0 0 0 20.992-8l331.008-340.992a29.952 29.952 0 0 0 8.96-22.016 29.952 29.952 0 0 0-8.96-22.016L382.976 148.928a30.592 30.592 0 0 0-20.992-8 30.592 30.592 0 0 0-20.992 8v0.064a32.256 32.256 0 0 0-8.96 22.016z"
              fill="#ccc"
              p-id="17236"
            ></path>
          </svg>
          <!-- 递归本组件，产生新的子菜单，并传入新的参数（menu，posX，posY，isTop） -->
          <rightMenu
            :menu="item.children"
            :posX="sonPosX"
            :posY="sonPosY"
            :isTop="false"
            :nowBoxWidth="ulWidth"
            :needReverse="sonNeedReverse"
            :canClickFather="canClickFather"
            :backgroundColor="backgroundColor"
            :activeColor="activeColor"
            :absoluteX="sonAbsoluteX"
            :showFlag="activeIndex === item.key"
            v-show="activeIndex === item.key"
            @emitClick="handleClick"
            ref="sonmenu"
          />
        </template>
      </li>
    </ul>
  </transition>
</template>
<script>
const isString = str => Object.prototype.toString.call(str) === "[object String]"
// 获取隐藏元素的宽高
const getHiddenEl = el => {
  let hiddenWidth = 0, hiddenHeight = 0;
  if (el.style.display === "none") {
    const baseTransform = el.style.transform
    el.style.transform = "translateY(-1000000px)";
    el.style.display = "block";
    hiddenWidth = el.clientWidth
    hiddenHeight = el.clientHeight
    el.style.transform = baseTransform;
    el.style.display = "none"
  } else {
    hiddenWidth = el.clientWidth
    hiddenHeight = el.clientHeight
  }
  return {
    hiddenWidth,
    hiddenHeight
  }
}
export default {
  name: "rightMenu",
  props: {
    // 配置项
    menu: { // 本节点的菜单选项
      type: Array,
      default: () => { }
    },
    canClickFather: { // 点击父级节点是否也触发事件
      type: Boolean,
      default: false
    },
    canHoverOut: { // 是否能悬浮在ctxmenu之外
      type: Boolean,
      default: false
    },
    backgroundColor: {
      type: String,
      default: ""
    },
    activeColor: {
      type: String,
      default: ""
    },
    isTop: { // 是否是最顶层的那个组件，顶层组件需要特殊处理
      type: Boolean,
      default: true
    },
    posX: {
      type: Number,
      default: 0
    },
    posY: {
      type: Number,
      default: 0
    },
    nowBoxWidth: { // 当前ul的宽度, 用于计算子节点的X坐标
      type: Number,
      default: 0
    },
    absoluteX: { // 当前ul的绝对坐标
      type: Number,
      default: 0
    },
    needReverse: { // 是否需要翻转，窗口右侧点击的时候需要
      type: Boolean,
      default: false
    },
    showFlag: { // 显示隐藏切换，控制子节点的activeindex
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      activeIndex: null,
      sonPosX: 0, // 相对于父节点的x坐标
      sonPosY: 0,
      eventListening: false,
      isDestoryed: false,
      ulWidth: 0,
      sonNeedReverse: false,
      sonAbsoluteX: 0,
      hasImg: false, // 当前列表有没有图标
    }
  },
  watch: {
    showFlag () { // 每次切换显示隐藏之后清空子项的active项
      this.activeIndex = null
    }
  },
  methods: {
    handleContextmenu (event) {
      event.preventDefault()
    },
    handleMouseover (event, item, index) {
      event.stopPropagation()
      this.activeIndex = item.key
      // 如果有子项，就获取子项的位置信息
      if (item.children && item.children.length) {
        let liNode = this.findInCtxMenu(event.target, "LI").el
        let ulNode = null
        if (event.target.nodeName === "UL" && !this.isTop) {
          ulNode = event.target
        } else {
          ulNode = this.findInCtxMenu(liNode, "UL").el
        }
        this.ulWidth = ulNode.clientWidth; // 当前UL的宽度
        if (liNode.lastChild && liNode.lastChild.nodeName === "UL") {
          const { hiddenWidth } = getHiddenEl(liNode.lastChild);
          if (this.absoluteX + this.ulWidth + hiddenWidth > document.body.clientWidth - 5) {
            this.sonNeedReverse = true
          } else {
            if (ulNode === this.$el) {
              this.sonPosX = this.ulWidth - 5
            }
          }
        }
        this.sonAbsoluteX = this.absoluteX + this.ulWidth; // 子节点的绝对坐标
        this.sonPosY = index * 32 + 5 // 如果换行这个就需要特殊处理
      }
    },
    handleClick (item, event) {
      if (event) {
        event.stopPropagation()
      }
      if (this.canClickFather
        || (!this.canClickFather && !item.children)
      ) {
        if (this.isTop) { // 顶层节点在实例化的时候定义了这个方法
          this.topEmitClick(item, event)
          this.destoryCom(event, true)
        } else {
          this.$emit("emitClick", item, event)
        }
      }
    },
    findInCtxMenu (el, tarNode) { // 判断一个元素是否是在ctx菜单里面, tarNode表示目标，为LI或者UL
      let flag = false
      let tempEl = el // 最近一个父级节点
      while (tempEl && !flag) {
        if (tempEl.className
          && isString(tempEl.className)
          && tempEl.className.indexOf("ctx-menu-") !== -1
          && (!tarNode || tarNode === tempEl.nodeName)
        ) {
          flag = true
        } else {
          tempEl = tempEl.parentNode
        }
      }
      return {
        flag,
        el: tempEl
      }
    },
    mouseWheelEvent (event) {
      this.destoryCom(event)
    },
    mouseClickEvent (event) {
      let { flag } = this.findInCtxMenu(event.target)
      if (!flag) {
        this.destoryCom(event)
      }
    },
    mouseMoveEvent (event) {
      let { flag } = this.findInCtxMenu(event.target)
      if (!flag) {
        this.activeIndex = null
      }
    },
    addEvent () {
      // 只绑定一次点击事件
      if (!this.eventListening && this.isTop) {
        document.addEventListener("click", this.mouseClickEvent);
        document.addEventListener("mousedown", this.mouseClickEvent);
        document.addEventListener("mousewheel", this.mouseWheelEvent);
        if (!this.canHoverOut) {
          document.addEventListener("mouseover", this.mouseMoveEvent);
        }
        this.eventListening = true;
      }
    },
    removeEvent () {
      document.removeEventListener("click", this.mouseClickEvent);
      document.removeEventListener("mousedown", this.mouseClickEvent);
      document.removeEventListener("mousewheel", this.mouseWheelEvent);
      document.addEventListener("mouseover", this.mouseMoveEvent);
      this.eventListening = false;
    },
    destoryCom (event, noEmit) {
      if (!noEmit) {
        this.topEmitCancel(event)
      }
      this.removeEvent()
      this.isDestoryed = true
    }
  },
  mounted () {
    this.addEvent()
    let hasImg = false
    for (let i = 0; i < this.menu.length; i++) {
      if (this.menu[i].img) {
        hasImg = true;
        break
      }
    }
    this.hasImg = hasImg
  },
  computed: {
    compstyle () {
      if (this.needReverse && !this.isTop) {
        return `background-color: ${this.backgroundColor};top: ${this.posY}px;right: 5px;`
      }
      return `background-color: ${this.backgroundColor};top: ${this.posY}px;left: ${this.posX}px;`
    }
  }
}
</script>
<style scoped>
ul,
li {
  list-style: none;
  padding: 0;
  margin: 0;
}
.ctx-menu-out {
  display: flex;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 5px;
  position: absolute;
  padding: 5px;
  width: fit-content;
}
.ctx-menu-out:not(.top) {
  max-width: 160px;
}
.ctx-menu-out.top {
  position: fixed;
  z-index: 1000000;
}
.ctx-menu-out.top .ctx-menu-item {
  width: 100%;
}
.ctx-menu-out .ctx-menu-item {
  cursor: pointer;
  min-height: 32px;
  line-height: 32px;
  border-radius: 3px;
  padding-left: 5px;
  display: flex;
  align-items: center;
  width: fit-content;
  min-width: 80px;
}
.ctx-menu-out .ctx-menu-item.active {
  background-color: #f5f5f5;
}
.ctx-menu-out .ctx-menu-item .labelbox {
  flex-grow: 1;
  font-size: 14px;
}
.ctx-menu-out .ctx-menu-item .svgright {
  flex-shrink: 0;
}
.itemlogo{width: 24px;height: 24px;margin-right: 5px;}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.leftin-enter-active {
  transition: transform ease-out 0.3s;
}
.leftin-leave-active {
  display: none;
}
.leftin-enter {
  transform: translateX(-20px);
}
</style>
