
<template>
  <div class="dropdown-wrapper">
    <button @click="toggleDropdown">Toggle Dropdown</button>
    <transition name="fade">
      <div v-show="show_dropdown" class="dropdown" ref="drop_list">
        <!-- 下拉选项内容 -->
        <ul>
          <li>Option 1</li>
          <li>Option 2</li>
          <li>Option 3</li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";



const drop_list = ref();
const show_dropdown = ref(false);

const toggleDropdown = () => {
  // 判断下拉框的高度是否大于容器剩余的高度
  const tt = drop_list.value.getBoundingClientRect();
  // const drop_list_height = drop_list.value.offsetHeight;
  // const drop_list_top = drop_list.value.getBoundingClientRect().top;
  // const drop_list_bottom = drop_list_top + drop_list_height;
  // //  获取外部容器的高度
  // const container_height = document.documentElement.clientHeight;
  // // 判断下拉框的高度是否大于容器剩余的高度
  // if (drop_list_bottom > container_height) {
  //   // drop_list.value.style.top = `-${drop_list_height}px`;
  //   console.log("上拉");
  // } else {
  //   console.log("下拉");
  // }

  show_dropdown.value = !show_dropdown.value;
};
</script>

<style scoped>
/* 过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 下拉选项框样式 */
.dropdown-wrapper {
  position: relative;
  display: inline-block;
}

.dropdown {
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  padding: 10px;
  position: absolute;
  top: 0;
  transform: translateY(-100%);
  left: 0;
  z-index: 1;
}

/* 下拉选项列表样式 */
.dropdown ul {
  list-style: none;
  padding: 0;
}

/* 下拉选项样式 */
.dropdown li {
  cursor: pointer;
  padding: 5px 0;
}

/* 鼠标悬停时的下拉选项样式 */
.dropdown li:hover {
  background-color: #ddd;
}
</style>
