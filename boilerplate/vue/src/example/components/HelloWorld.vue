<template>
  <div :class="$style.hello">
    <h1 :class="$style.heading">{{ msg }}</h1>
    <h2 :class="$style.heading">Essential Links</h2>
    <ul :class="$style.list">
      <li :class="$style.item">
        <a
          :class="$style.link"
          href="https://vuejs.org"
          target="_blank"
        >
          Core Docs
        </a>
      </li>
      <li :class="$style.item">
        <a
          :class="$style.link"
          href="https://forum.vuejs.org"
          target="_blank"
        >
          Forum
        </a>
      </li>
      <li :class="$style.item">
        <a
          :class="$style.link"
          href="https://chat.vuejs.org"
          target="_blank"
        >
          Community Chat
        </a>
      </li>
      <li :class="$style.item">
        <a
          :class="$style.link"
          href="https://twitter.com/vuejs"
          target="_blank"
        >
          Twitter
        </a>
      </li>
      <br>
      <li :class="$style.item">
        <a
          :class="$style.link"
          href="http://vuejs-templates.github.io/webpack/"
          target="_blank"
        >
          Docs for This Template
        </a>
      </li>
    </ul>
    <h2 :class="$style.heading">Ecosystem</h2>
    <ul :class="$style.list">
      <li :class="$style.item">
        <a
          :class="$style.link"
          href="http://router.vuejs.org/"
          target="_blank"
        >
          vue-router
        </a>
      </li>
      <li :class="$style.item">
        <a
          :class="$style.link"
          href="http://vuex.vuejs.org/"
          target="_blank"
        >
          vuex
        </a>
      </li>
      <li :class="$style.item">
        <a
          :class="$style.link"
          href="http://vue-loader.vuejs.org/"
          target="_blank"
        >
          vue-loader
        </a>
      </li>
      <li :class="$style.item">
        <a
          :class="$style.link"
          href="https://github.com/vuejs/awesome-vue"
          target="_blank"
        >
          awesome-vue
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style module>
.hello {
  padding: 20rpx; /* it will transform to 0.4rem */
}

.heading {
  font-weight: normal;
}

.list {
  list-style-type: none;
  padding: 0;
}

.item {
  display: inline-block;
  margin: 0 10px;
}

.link {
  color: #42b983;
}
</style>
