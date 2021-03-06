<template>
  <div class="vdr" :style="style" :class="{
      draggable: draggable,
      resizable: resizable,
      active: enabled,
      dragging: dragging,
      resizing: resizing
    }" @mousedown="elmDown" @touchstart="elmDown" @dblclick.stop.prevent="fillParent">
    <div v-for="handle in handles" v-if="resizable" class="handle" :key="handle" :class="'handle-' + handle" :style="{ display: enabled ? 'block' : 'none'}" @mousedown="handleDown(handle, $event)" @touchstart="handleDown(handle, $event)">
    </div>
    <slot></slot>
    <div class='explain' :style="explainStyle">
      <slot name='explain'></slot>
    </div>
  </div>
</template>

<script>
import { matchesSelectorToParentElements } from './utils/dom'

export default {
  replace: true,
  name: 'VueDraggableResizable',
  props: {
    active: {
      type: Boolean, default: false,
    },
    draggable: {
      type: Boolean, default: true,
    },
    resizable: {
      type: Boolean, default: true,
    },
    spacer: {
      type: Number, default: 20,
    },
    w: {
      type: Number,
      default: 200,
      validator(val) {
        return val > 0
      },
    },
    h: {
      type: Number,
      default: 200,
      validator(val) {
        return val > 0
      },
    },
    minw: {
      type: Number,
      default: 50,
      validator(val) {
        return val >= 0
      },
    },
    minh: {
      type: Number,
      default: 50,
      validator(val) {
        return val >= 0
      },
    },
    x: {
      type: Number,
      default: 0,
      validator(val) {
        return typeof val === 'number'
      },
    },
    y: {
      type: Number,
      default: 0,
      validator(val) {
        return typeof val === 'number'
      },
    },
    z: {
      type: [String, Number],
      default: 'auto',
      validator(val) {
        const valid = (typeof val === 'string') ? val === 'auto' : val >= 0
        return valid
      },
    },
    handles: {
      type: Array,
      default() {
        return ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml']
      },
      validator(val) {
        const s = new Set(['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'])

        return new Set(val.filter(h => s.has(h))).size === val.length
      },
    },
    dragHandle: {
      type: String,
      default: null,
    },
    dragCancel: {
      type: String,
      default: null,
    },
    axis: {
      type: String,
      default: 'both',
      validator(val) {
        return ['x', 'y', 'both'].indexOf(val) !== -1
      },
    },
    grid: {
      type: Array,
      default() {
        return [1, 1]
      },
    },
    parent: {
      type: Boolean, default: false,
    },
    maximize: {
      type: Boolean, default: false,
    },
    // ---
    // 鼠标放上是否有提示
    hoverTip: {
      type: Boolean, default: false,
    },
    changeIsHover: {
      type: Function,
      default: (res) => {
        return {
          res: '',
        }
      },
    },
  },

  created() {
    this.parentX = 0
    this.parentW = 9999
    this.parentY = 0
    this.parentH = 9999

    this.mouseX = 0
    this.mouseY = 0

    this.lastMouseX = 0
    this.lastMouseY = 0

    this.mouseOffX = 0
    this.mouseOffY = 0

    this.elmX = 0
    this.elmY = 0

    this.elmW = 0
    this.elmH = 0
  },
  mounted() {
    this.$el.addEventListener('mousemove', this.handleMove, true)
    // document.documentElement.addEventListener('mousedown', this.deselect, true)
    // this.$el.addEventListener('mouseup', this.handleUp, true)
    this.$el.addEventListener('mouseenter', this.handleEnter, true) //--
    this.$el.addEventListener('mouseleave', this.handleLeave, true) //--

    // touch events bindings
    this.$el.addEventListener('touchmove', this.handleMove, true)
    // document.documentElement.addEventListener('touchend touchcancel', this.deselect, true)
    // this.$el.addEventListener('touchstart', this.handleUp, true)
    // document.documentElement.addEventListener('touchstart', this.deselect, true)

    this.elmX = parseInt(this.$el.style.left)
    this.elmY = parseInt(this.$el.style.top)
    this.elmW = this.$el.offsetWidth || this.$el.clientWidth
    this.elmH = this.$el.offsetHeight || this.$el.clientHeight


    this.reviewDimensions()
  },
  beforeDestroy() {
    this.$el.removeEventListener('mousemove', this.handleMove, true)
    // document.documentElement.removeEventListener('mousedown', this.deselect, true)
    // this.$el.removeEventListener('mouseup', this.handleUp, true)
    this.$el.removeEventListener('mouseenter', this.handleEnter, true) // --
    this.$el.removeEventListener('mouseleave', this.handleLeave, true) // --

    // touch events bindings removed
    this.$el.removeEventListener('touchmove', this.handleMove, true)
    // document.documentElement.removeEventListener('touchend touchcancel', this.deselect, true)
    // document.documentElement.removeEventListener('touchstart', this.handleUp, true)
    // this.$el.removeEventListener('touchstart', this.deselect, true)
  },

  data() {
    return {
      top: this.y,
      left: this.x,
      width: this.w,
      height: this.h,
      resizing: false,
      dragging: false,
      enabled: this.active,
      handle: null,
      zIndex: this.z,
      // explain start
      showExplain: false,
      explain_top: 0,
      explain_left: 0,
      // explain end
    }
  },

  methods: {
    reviewDimensions() {
      if (this.minw > this.w) this.width = this.minw

      if (this.minh > this.h) this.height = this.minh

      if (this.parent) {
        const parentW = parseInt(this.$el.parentNode.clientWidth, 10)
        const parentH = parseInt(this.$el.parentNode.clientHeight, 10)

        this.parentW = parentW
        this.parentH = parentH

        if (this.w > this.parentW) this.width = parentW

        if (this.h > this.parentH) this.height = parentH

        if ((this.x + this.w) > this.parentW) this.width = parentW - this.x

        if ((this.y + this.h) > this.parentH) this.height = parentH - this.y
      }

      this.elmW = this.width
      this.elmH = this.height

      this.$emit('resizing', this.left, this.top, this.width, this.height)
    },
    elmDown(e) {
      const target = e.target || e.srcElement

      if (this.$el.contains(target)) {
        if (
          (this.dragHandle && !matchesSelectorToParentElements(target, this.dragHandle, this.$el))
          || (this.dragCancel && matchesSelectorToParentElements(target, this.dragCancel, this.$el))) {
          return
        }

        this.reviewDimensions()

        if (!this.enabled) {
          this.enabled = true

          this.$emit('activated')
          this.$emit('update:active', true)
        }

        if (this.draggable) {
          this.dragging = true
        }
      }
    },
    deselect(e) {
      if (e.type.indexOf('touch') !== -1) {
        this.mouseX = e.changedTouches[0].clientX
        this.mouseY = e.changedTouches[0].clientY
      } else {
        this.mouseX = e.pageX || e.clientX + document.documentElement.scrollLeft
        this.mouseY = e.pageY || e.clientY + document.documentElement.scrollTop
      }

      this.lastMouseX = this.mouseX
      this.lastMouseY = this.mouseY

      const target = e.target || e.srcElement
      const regex = new RegExp('handle-([trmbl]{2})', '')

      if (!this.$el.contains(target) && !regex.test(target.className)) {
        if (this.enabled) {
          this.enabled = false

          this.$emit('deactivated')
          this.$emit('update:active', false)
        }
      }
    },
    handleDown(handle, e) {
      this.handle = handle

      if (e.cancelable) {
        e.stopPropagation()
        e.preventDefault()
      }

      this.resizing = true
    },
    fillParent(e) {
      this.$emit('dbclick')
      if (!this.parent || !this.resizable || !this.maximize) return

      let done = false

      const animate = () => {
        if (!done) {
          window.requestAnimationFrame(animate)
        }

        if (this.axis === 'x') {
          if (
            this.width === this.parentW && this.left === this.parentX
          ) done = true
        } else if (this.axis === 'y') {
          if (
            this.height === this.parentH && this.top === this.parentY
          ) done = true
        } else if (this.axis === 'both') {
          if (
            this.width === this.parentW
            && this.height === this.parentH
            && this.top === this.parentY
            && this.left === this.parentX
          ) done = true
        }

        if (this.axis === 'x' || this.axis === 'both') {
          if (this.width < this.parentW) {
            this.width++
            this.elmW++
          }

          if (this.left > this.parentX) {
            this.left--
            this.elmX--
          }
        }

        if (this.axis === 'y' || this.axis === 'both') {
          if (this.height < this.parentH) {
            this.height++
            this.elmH++
          }

          if (this.top > this.parentY) {
            this.top--
            this.elmY--
          }
        }

        this.$emit('resizing', this.left, this.top, this.width, this.height)
      }

      window.requestAnimationFrame(animate)
    },
    handleMove(e) {
      const isTouchMove = e.type.indexOf('touchmove') !== -1
      this.mouseX = isTouchMove
        ? e.touches[0].clientX
        : e.pageX || e.clientX + document.documentElement.scrollLeft
      this.mouseY = isTouchMove
        ? e.touches[0].clientY
        : e.pageY || e.clientY + document.documentElement.scrollTop

      let diffX = this.mouseX - this.lastMouseX + this.mouseOffX
      let diffY = this.mouseY - this.lastMouseY + this.mouseOffY

      this.mouseOffX = this.mouseOffY = 0

      this.lastMouseX = this.mouseX
      this.lastMouseY = this.mouseY

      const dX = diffX
      const dY = diffY
      if (this.resizing) {
        this.showExplain = false // resize时不显示
        if (this.handle.indexOf('t') >= 0) {
          if (this.elmH - dY < this.minh) this.mouseOffY = (dY - (diffY = this.elmH - this.minh))
          else if (this.parent && this.elmY + dY < this.parentY) this.mouseOffY = (dY - (diffY = this.parentY - this.elmY))
          this.elmY += diffY
          this.elmH -= diffY
        }

        if (this.handle.indexOf('b') >= 0) {
          if (this.elmH + dY < this.minh) this.mouseOffY = (dY - (diffY = this.minh - this.elmH))
          else if (this.parent && this.elmY + this.elmH + dY > this.parentH) this.mouseOffY = (dY - (diffY = this.parentH - this.elmY - this.elmH))
          this.elmH += diffY
        }

        if (this.handle.indexOf('l') >= 0) {
          if (this.elmW - dX < this.minw) this.mouseOffX = (dX - (diffX = this.elmW - this.minw))
          else if (this.parent && this.elmX + dX < this.parentX) this.mouseOffX = (dX - (diffX = this.parentX - this.elmX))
          this.elmX += diffX
          this.elmW -= diffX
        }

        if (this.handle.indexOf('r') >= 0) {
          const { spacer, width } = this
          if (this.elmW + dX < this.minw) this.mouseOffX = (dX - (diffX = this.minw - this.elmW))
          else if (this.parent && this.elmX + this.elmW + dX > this.parentW) this.mouseOffX = (dX - (diffX = this.parentW - this.elmX - this.elmW))
          if ((this.elmW + diffX) < spacer) {
            // 最小宽度不能小于一个spacer的宽度
            this.elmW = spacer
          } else {
            this.elmW += diffX
          }
        }


        this.left = (Math.round(this.elmX / this.grid[0]) * this.grid[0])
        this.top = (Math.round(this.elmY / this.grid[1]) * this.grid[1])

        this.width = (Math.round(this.elmW / this.grid[0]) * this.grid[0])
        this.height = (Math.round(this.elmH / this.grid[1]) * this.grid[1])

        this.$emit('resizing', this.left, this.top, this.width, this.height)
      } else if (this.dragging) {
        this.showExplain = false // 拖拽时不显示

        if (this.parent) {
          if (this.elmX + dX < this.parentX) this.mouseOffX = (dX - (diffX = this.parentX - this.elmX))
          else if (this.elmX + this.elmW + dX > this.parentW) this.mouseOffX = (dX - (diffX = this.parentW - this.elmX - this.elmW))

          if (this.elmY + dY < this.parentY) this.mouseOffY = (dY - (diffY = this.parentY - this.elmY))
          else if (this.elmY + this.elmH + dY > this.parentH) this.mouseOffY = (dY - (diffY = this.parentH - this.elmY - this.elmH))
        }

        this.elmX += diffX
        this.elmY += diffY

        if (this.axis === 'x' || this.axis === 'both') {
          this.left = (Math.round(this.elmX / this.grid[0]) * this.grid[0])
        }
        if (this.axis === 'y' || this.axis === 'both') {
          this.top = (Math.round(this.elmY / this.grid[1]) * this.grid[1])
        }

        // do draw shadow

        this.$emit('dragging', this.left, this.top)
      }

      this.handleExplainMove(e)
    },
    handleUp(e) {
      if (e.type.indexOf('touch') !== -1) {
        this.lastMouseX = e.changedTouches[0].clientX
        this.lastMouseY = e.changedTouches[0].clientY
      }
      this.handle = null
      if (this.resizing) {
        this.resizing = false
        this.$emit('resizestop', this.left, this.top, this.width, this.height)
      }
      if (this.dragging) {
        this.dragging = false
        this.$emit('dragstop', this.left, this.top)
      }

      const {
        spacer, left, top, width,
      } = this
      const remainderLeft = left % spacer
      // left取整(spacer)
      let nLeft
      if (remainderLeft > spacer / 2) {
        nLeft = Math.floor(left / spacer) * spacer // 向上取整
      } else {
        nLeft = Math.ceil(left / spacer) * spacer // 向下取整
      }

      const remainderWidth = width % spacer
      // width取整(spacer)
      let nWidth

      if (remainderWidth > spacer / 2) {
        nWidth = Math.floor(width / spacer) * spacer
      } else {
        nWidth = Math.ceil(width / spacer) * spacer
      }


      this.elmX = this.left = nLeft || left
      this.elmY = top

      // ====
      this.width = nWidth
      this.reviewDimensions()
    },
    // dragging时的影子
    shadow() {

    },
    handleExplainMove(e) {
      const explain = this.$el.querySelector('.explain')
      const { clientX, clientY } = e
      const { offsetLeft, offsetTop } = this.$el
      const { offsetWidth, offsetHeight } = explain
      const _pageLeft = clientX - offsetLeft + 5
      const _pageTop = clientY - offsetTop + 5
      // if (_pageLeft >= clientX - offsetWidth) {
      //   _pageLeft = clientX - offsetWidth - 5
      // }

      // if (_pageTop >= clientY - offsetHeight) {
      //   _pageTop = clientY - offsetHeight - 5
      // }

      // this.explain_top = _pageTop
      // this.explain_left = _pageLeft
    },
    // 鼠标移入dom
    handleEnter(e) {
      // this.showExplain = true
      this.$emit('hover', true)
    },
    // 鼠标移除dom
    handleLeave() {
      // this.showExplain = false
      this.$emit('hover', false)
    },
  },

  computed: {
    style() {
      return {
        transform: `translate(${this.left}px,${this.top}px)`,
        // top: `${this.top}px`,
        // left: `${this.left}px`,
        width: `${this.width}px`,
        height: `${this.height}px`,
        zIndex: this.zIndex,
      }
    },
    explainStyle() {
      const { showExplain, explain_left, explain_top } = this
      return {
        display: showExplain ? 'block' : 'none',
        transform: `translate(${explain_left}px,${explain_top}px)`,
      }
    },
  },

  watch: {
    active(val) {
      this.enabled = val
    },
    z(val) {
      if (val >= 0 || val === 'auto') {
        this.zIndex = val
      }
    },
  },
}
</script>
