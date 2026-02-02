# 路由过渡动画实现对比 - Vue 3 版本

## 📚 Vue 核心概念先理解

在讲具体实现前，先理解 Vue 中的关键点：

### 1. Vue 的 watch 监听
```vue
<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

watch(() => route.path, (newPath, oldPath) => {
  console.log(`路由从 ${oldPath} 变成了 ${newPath}`)
})
</script>
```

### 2. Vue Transition 的钩子
```vue
<template>
  <Transition
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @after-enter="onAfterEnter"
  >
    <div>内容</div>
  </Transition>
</template>

<script setup>
const onAfterEnter = () => {
  console.log('进入动画完成了！')
}
</script>
```

### 3. Vue Router 的路由变化时机
```js
router.push('/new-page')  // ← 调用后
// → route.path 立即变化
// → 但新页面组件可能还在加载/渲染
```

### 4. provide/inject 全局状态共享
```vue
<!-- App.vue -->
<script setup>
import { provide, ref } from 'vue'

const isTransitioning = ref(false)
provide('isTransitioning', isTransitioning)  // 提供给子组件
</script>

<!-- 子组件 -->
<script setup>
import { inject } from 'vue'

const isTransitioning = inject('isTransitioning')  // 获取共享状态
</script>
```

---

## 🔴 方案一：监听路由变化自动结束（有问题的版本）

### 核心思路
```
点击链接 → 开始动画 → 路由跳转 → route.path 变化 → 监听到变化 → 等 500ms → 结束动画
```

### 代码实现

#### 1. composables/useTransition.js - 过渡状态管理
```js
// composables/useTransition.js
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const isTransitioning = ref(false)
const transitionStartTime = ref(null)

export function useTransition() {
  const route = useRoute()

  // 👇 关键代码：监听路由变化
  watch(() => route.path, () => {
    if (isTransitioning.value && transitionStartTime.value) {
      const elapsed = Date.now() - transitionStartTime.value
      const remainingTime = Math.max(0, 500 - elapsed)  // 至少 500ms

      setTimeout(() => {
        isTransitioning.value = false  // ← 500ms 后关闭动画
      }, remainingTime)
    }
  })
  // ↑ route.path 变化时，这个 watch 会触发

  const startTransition = () => {
    isTransitioning.value = true
    transitionStartTime.value = Date.now()
  }

  return {
    isTransitioning,
    startTransition
  }
}
```

#### 2. components/TransitionLink.vue - 路由链接组件
```vue
<template>
  <router-link
    :to="to"
    @click="handleClick"
  >
    <slot />
  </router-link>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useTransition } from '@/composables/useTransition'

const props = defineProps({
  to: String
})

const router = useRouter()
const { startTransition } = useTransition()

const handleClick = (e) => {
  e.preventDefault()

  startTransition()      // ← 步骤1: 开始动画
  router.push(props.to)  // ← 步骤2: 立即跳转路由
}
</script>
```

#### 3. components/TransitionOverlay.vue - 加载动画遮罩
```vue
<template>
  <Transition name="fade">
    <div v-if="isTransitioning" class="loading-overlay">
      <LoadingSpinner />  <!-- 旋转的三角形 LOGO -->
    </div>
  </Transition>
</template>

<script setup>
import { useTransition } from '@/composables/useTransition'
import LoadingSpinner from './LoadingSpinner.vue'

const { isTransitioning } = useTransition()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}
</style>
```

#### 4. App.vue - 主应用
```vue
<template>
  <div id="app">
    <Navigation />

    <router-view v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </router-view>

    <TransitionOverlay />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import Navigation from './components/Navigation.vue'
import TransitionOverlay from './components/TransitionOverlay.vue'

const route = useRoute()
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.4s, transform 0.4s;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
```

### 执行流程（时间线）

```
用户点击 "角色页面" 链接

t=0ms:
  ↓ handleClick 执行
  ↓ startTransition() → isTransitioning.value = true
  ↓ TransitionOverlay 显示加载动画
  ↓ router.push('/characters')

t=1ms:  (几乎瞬间)
  ↓ route.path 从 '/project' 变成 '/characters'
  ↓ watch 监听到 route.path 变化
  ↓ 设置定时器：500ms 后关闭动画

t=2ms ~ t=500ms:
  → 显示加载动画（旋转的 LOGO）
  → Vue Router 开始加载新组件
  → 页面内容可能还在渲染...
  → 图片可能还在加载...

t=500ms:
  ↓ 定时器触发
  ↓ isTransitioning.value = false
  ↓ 加载动画消失 ❌ 但页面可能还没渲染完！

t=500ms ~ t=1000ms:
  → 用户可能看到白屏
  → 或者看到内容突然闪现
  → 体验不流畅 ❌
```

### ❌ 问题在哪？

```js
watch(() => route.path, () => {
  // 只要 route.path 变了，就会在 500ms 后关闭动画
  // 但 route.path 变化 ≠ 页面渲染完成！
})  // ← 问题根源
```

**route.path 变化的时机：** 路由跳转后立即变化（1-5ms）
**页面真正渲染完的时机：** 需要加载数据、渲染组件、加载图片（500-2000ms）

---

## 🟢 方案二：监听 Transition 完成回调（正确的实现）

### 核心思路
```
点击链接 → 开始动画 → 路由跳转 → 新页面渲染 → 进入动画播放 → 动画完成回调 → 结束加载动画
```

### 代码实现

#### 1. composables/useTransition.js - 过渡状态管理（修改后）
```js
// composables/useTransition.js
import { ref } from 'vue'

const isTransitioning = ref(false)
const transitionStartTime = ref(null)
const MIN_TRANSITION_TIME = 500

export function useTransition() {
  // ❌ 删除了 watch 监听路由的代码

  const startTransition = () => {
    // 防止重复点击
    if (isTransitioning.value) return  // ← 新增保护

    isTransitioning.value = true
    transitionStartTime.value = Date.now()
  }

  const finishTransition = () => {
    if (!transitionStartTime.value) return

    const elapsed = Date.now() - transitionStartTime.value
    const remainingTime = Math.max(0, MIN_TRANSITION_TIME - elapsed)

    setTimeout(() => {
      isTransitioning.value = false  // ← 确保至少显示 500ms
      transitionStartTime.value = null
    }, remainingTime)
  }

  return {
    isTransitioning,
    startTransition,
    finishTransition  // ← 暴露给外部主动调用
  }
}
```

#### 2. App.vue - 主应用（修改后）
```vue
<template>
  <div id="app">
    <Navigation />

    <!-- 👇 关键：使用 Transition 的钩子 -->
    <router-view v-slot="{ Component, route }">
      <Transition
        name="page"
        mode="out-in"
        @after-enter="onPageEnterComplete"
      >
        <!-- ↑ 进入动画完成后的回调 -->
        <component :is="Component" :key="route.path" />
      </Transition>
    </router-view>

    <TransitionOverlay />
  </div>
</template>

<script setup>
import { useTransition } from '@/composables/useTransition'
import Navigation from './components/Navigation.vue'
import TransitionOverlay from './components/TransitionOverlay.vue'

const { finishTransition } = useTransition()

// 👇 页面进入动画完成后调用
const onPageEnterComplete = () => {
  finishTransition()
}
</script>

<style>
.page-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.page-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
```

#### 3. components/TransitionLink.vue - 路由链接（优化后）
```vue
<template>
  <router-link
    :to="to"
    :class="linkClass"
    @click="handleClick"
  >
    <slot />
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTransition } from '@/composables/useTransition'

const props = defineProps({
  to: String
})

const router = useRouter()
const { startTransition, isTransitioning } = useTransition()

// 过渡中禁用点击 + 半透明提示
const linkClass = computed(() => ({
  'pointer-events-none': isTransitioning.value,
  'opacity-60': isTransitioning.value
}))

const handleClick = (e) => {
  e.preventDefault()

  startTransition()  // 如果已在过渡中，会被忽略
  router.push(props.to)
}
</script>
```

### 执行流程（时间线）

```
用户点击 "角色页面" 链接

t=0ms:
  ↓ handleClick 执行
  ↓ startTransition() → isTransitioning.value = true
  ↓ TransitionOverlay 显示加载动画
  ↓ router.push('/characters')

t=1ms:
  ↓ route.path 变化
  ↓ Vue Router 检测到路由变化
  ↓ 触发 page-leave 动画（旧页面）
  ↓ 旧页面淡出 (0.4s)

t=400ms:
  ↓ 旧页面离开动画完成
  ↓ 旧组件卸载
  ↓ 新组件开始挂载

t=450ms ~ t=600ms:
  → 显示加载动画（旋转的 LOGO）
  → CharactersPage 组件渲染
  → 图片开始加载
  ✅ 新组件挂载完成

t=600ms:
  ↓ 触发 page-enter 动画（新页面）
  → opacity: 0 → 1 (0.4s)
  → translateY: 20px → 0 (0.4s)

t=1000ms: (600ms + 400ms 动画)
  ✅ 进入动画播放完成
  ✅ @after-enter 钩子触发
  ↓ 调用 onPageEnterComplete()
  ↓ 调用 finishTransition()
  ↓ 计算经过时间: 1000ms - 0ms = 1000ms
  ↓ 剩余时间: max(0, 500 - 1000) = 0ms
  ↓ 立即关闭加载动画

t=1000ms:
  ✅ isTransitioning.value = false
  ✅ TransitionOverlay 消失
  ✅ 用户看到完整渲染的页面
  ✅ 过渡流畅！
```

### ✅ 为什么这样就对了？

#### 关键1: `key` 属性的作用
```vue
<component :is="Component" :key="route.path" />
```

在 Vue 中，`key` 改变时，组件会**完全重新创建**：
- route.path = '/project' → 组件 A 创建
- route.path = '/characters' → 组件 A 销毁，组件 B 创建
- 组件 B 创建时会从头播放进入动画

#### 关键2: `@after-enter` 钩子的时机
```vue
<Transition @after-enter="onPageEnterComplete">
```

这个钩子触发时，意味着：
1. ✅ 新页面组件已经挂载
2. ✅ 新页面内容已经渲染
3. ✅ 进入动画已经播放完成
4. ✅ 用户已经能看到完整页面

**所以这时关闭加载动画是安全的！**

#### 关键3: `mode="out-in"` 的作用
```vue
<Transition mode="out-in">
```

- `mode="out-in"`: 旧组件先离开，再显示新组件（推荐）
- `mode="in-out"`: 新组件先进入，再隐藏旧组件
- 不设置: 两个组件同时存在（可能重叠）

---

## 🎨 使用 VueUse Motion 增强版本

如果想要更强大的动画控制，可以使用 `@vueuse/motion`：

### 安装
```bash
npm install @vueuse/motion
```

### App.vue - 使用 Motion
```vue
<template>
  <div id="app">
    <Navigation />

    <router-view v-slot="{ Component, route }">
      <!-- 使用 motion 指令 -->
      <component
        :is="Component"
        :key="route.path"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 400 } }"
        :leave="{ opacity: 0, y: -20, transition: { duration: 400 } }"
        @motion-complete="onMotionComplete"
      />
    </router-view>

    <TransitionOverlay />
  </div>
</template>

<script setup>
import { useTransition } from '@/composables/useTransition'
import Navigation from './components/Navigation.vue'
import TransitionOverlay from './components/TransitionOverlay.vue'

const { finishTransition } = useTransition()

const onMotionComplete = (definition) => {
  // 只在进入动画完成时触发
  if (definition === 'enter') {
    finishTransition()
  }
}
</script>
```

---

## 📊 Vue Transition 钩子完整列表

```vue
<Transition
  @before-enter="onBeforeEnter"    // 进入前
  @enter="onEnter"                  // 进入中（可控制动画时长）
  @after-enter="onAfterEnter"       // 进入后 ✅ 我们用这个
  @enter-cancelled="onEnterCancelled"  // 进入取消

  @before-leave="onBeforeLeave"    // 离开前
  @leave="onLeave"                  // 离开中
  @after-leave="onAfterLeave"       // 离开后
  @leave-cancelled="onLeaveCancelled"  // 离开取消
>
  <div v-if="show">内容</div>
</Transition>
```

### 钩子参数说明
```js
const onEnter = (el, done) => {
  // el: DOM 元素
  // done: 调用此函数标记动画完成（用于 JS 动画）

  // 如果使用 CSS transition，不需要调用 done
  // Vue 会自动检测 transitionend 事件
}
```

---

## 🆚 React vs Vue 概念对应表

| React | Vue 3 | 说明 |
|-------|-------|------|
| `useState` | `ref` / `reactive` | 响应式状态 |
| `useEffect` | `watchEffect` / `watch` | 副作用监听 |
| `useContext` + `Context.Provider` | `provide` + `inject` | 跨组件状态共享 |
| `useRef` | `ref(dom元素)` | DOM 引用 |
| Framer Motion | Vue Transition / @vueuse/motion | 动画库 |
| `pathname` (Next.js) | `route.path` (Vue Router) | 当前路由路径 |
| `router.push()` | `router.push()` | 路由跳转（方法相同） |
| `key={pathname}` | `:key="route.path"` | 强制重新渲染 |
| `onAnimationComplete` | `@after-enter` | 动画完成回调 |

---

## 🎯 关键知识点总结

### 1. Vue 的 watch vs watchEffect
```js
// watch: 监听特定响应式数据
watch(() => route.path, (newPath) => {
  console.log('路由变了', newPath)
})

// watchEffect: 自动追踪依赖
watchEffect(() => {
  console.log('route.path 是', route.path)
  // route.path 变化时会自动重新执行
})
```

### 2. Vue Transition 的 mode
```vue
<!-- out-in: 旧元素先离开，新元素再进入（推荐） -->
<Transition mode="out-in">

<!-- in-out: 新元素先进入，旧元素再离开 -->
<Transition mode="in-out">

<!-- 默认: 两个元素同时存在 -->
<Transition>
```

### 3. Vue Router 的 router-view 插槽
```vue
<router-view v-slot="{ Component, route }">
  <!-- Component: 当前路由组件 -->
  <!-- route: 当前路由对象 -->
  <component :is="Component" :key="route.path" />
</router-view>
```

### 4. composables 模式
```js
// composables/useXxx.js
export function useXxx() {
  const state = ref(0)

  const method = () => {
    state.value++
  }

  return { state, method }
}

// 在组件中使用
const { state, method } = useXxx()
```

### 5. CSS 过渡类名规则
```css
/* name="fade" 时的类名 */
.fade-enter-active  { /* 进入过程中 */ }
.fade-leave-active  { /* 离开过程中 */ }
.fade-enter-from    { /* 进入起点 */ }
.fade-enter-to      { /* 进入终点 */ }
.fade-leave-from    { /* 离开起点 */ }
.fade-leave-to      { /* 离开终点 */ }
```

---

## 💡 实战建议（Vue 版本）

1. **使用 Composition API** 而不是 Options API
   - 更容易复用逻辑（composables）
   - 类型推导更好（TypeScript）

2. **利用 Vue 的 Transition 系统**
   - 内置的 Transition 组件功能强大
   - 钩子丰富，性能优秀

3. **合理使用 provide/inject**
   - 适合全局状态（如 loading）
   - 不适合频繁变化的数据（用 Pinia/Vuex）

4. **注意 key 的使用**
   - 确保路由变化时组件重新创建
   - 避免复用组件导致状态残留

5. **动画时长匹配**
   - CSS transition duration = JS 中的动画时长
   - 确保钩子触发时机准确

---

## 📦 完整项目结构

```
src/
├── App.vue
├── router/
│   └── index.js
├── composables/
│   └── useTransition.js
├── components/
│   ├── Navigation.vue
│   ├── TransitionLink.vue
│   ├── TransitionOverlay.vue
│   └── LoadingSpinner.vue
└── views/
    ├── Home.vue
    ├── Characters.vue
    ├── Project.vue
    └── Tech.vue
```

---

## 🔗 相关资源

- [Vue Transition 官方文档](https://cn.vuejs.org/guide/built-ins/transition.html)
- [Vue Router 官方文档](https://router.vuejs.org/zh/)
- [@vueuse/motion](https://motion.vueuse.org/)
- [Vue Composition API](https://cn.vuejs.org/guide/extras/composition-api-faq.html)

---

希望这个 Vue 版本的教学对你有帮助！Vue 的 Transition 系统比 React 更成熟，用起来更简单 😄
