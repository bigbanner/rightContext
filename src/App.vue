<template>
  <div id="app">
    <p @contextmenu.prevent="handleContextMenu">我是一段测试的文本</p>
  </div>
</template>

<script>
import imglogo from "./assets/img/nopic.png"
export default {
  name: 'App',
  methods: {
    handleContextMenu (event) {
      const menu = [
        {
          label: "添加",
          key: "add",
          children: [
            {
              label: "在上方添加",
              key: "addbefore"
            },
            {
              label: "在下方添加",
              key: "addafter"
            },
            {
              label: "下级添加",
              key: "addin"
            },
          ]
        },
        {
          label: "移动",
          key: "move",
          img: imglogo,
          children: [
            {
              label: "上移",
              key: "moveup",
            },
            {
              label: "下移",
              key: "movedown",
            },
            {
              label: "降级",
              key: "minuslevel"
            },
            {
              label: "升级",
              key: "uplevel"
            },
          ]
        },
        {
          label: "删除",
          key: "delete"
        },
        {
          label: "重命名",
          key: "rename"
        },
      ]
      const options = {
        menu,
        event
      }
      this.$rightCtx(options).then(res => {
        console.log("成功", res);
      }).catch(err => {
        console.log("失败", err);
      })
    },
  }
}
</script>
