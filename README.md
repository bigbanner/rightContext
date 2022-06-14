# app

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### 使用方法
```
1.复制components文件夹中的两个文件到项目中
2.引入js文件
3.Vue.use()使用一下引入的js文件
4.在需要的地方绑定点击事件，注意加上@contextmenu.prevent
```

### 参数说明
```
* @param options.menu 右键的菜单选项
* @param options.event 右键点击事件
* @param options.posX 如果不传event对象，则需要指定X坐标
* @param options.posY 如果不传event对象，则需要指定Y坐标
* @param options.canClickFather 点击父级节点是否也触发事件
* @param options.canHoverOut 鼠标是否可以悬浮在ctxmenu之外
* @param options.backgroundColor 背景色
* @param options.activeColor 弹窗悬浮颜色
* @param options.nowBoxWidth 顶级弹窗的宽度
```
menu 数组中的对象结构应该为
```
{
  label: "移动", // 菜单显示的文字
  key: "move", // 数组必要的key
  img: imglogo, // 非必填，选项前面的小图片，目前仅支持图片形式，推荐24*24
  children // 子菜单数组，
}
```
![演示demo](./src/assets/demo.gif "演示demo")
