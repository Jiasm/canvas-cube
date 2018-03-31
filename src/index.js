// @flow

declare type Coord = {
  x: number,
  y: number
}

declare type RenderConfig = {
  context: any,
  origin: Coord,
  offset: Coord,
  boxWidth: number,
  boxHeight: number,
  colors: Array<string>
}

// init canvas
let $canvas: any = document.querySelector('#canvas')

if ($canvas && $canvas.getContext) {
  let width:number = $canvas.width = window.innerWidth
  let height:number = $canvas.height = window.innerHeight

  let context = $canvas.getContext('2d')

  let boxWidth:number = 40
  let boxHeight:number = 40

  /**
   * 渲染一个矩形到`canvas`
   * @param   {any}       context `canvas.getContext`
   * @returns {function}          render function
   */
  function getRender(context) {
    return function render (x: number, y: number, width: number, height: number, color: string): void {
      context.beginPath()
      context.moveTo(x, y)                  // 左上
      context.lineTo(x + width, y)          // 右上
      context.lineTo(x + width, y + height) // 右下
      context.lineTo(x, y + height)          // 左下

      context.fillStyle = color
      context.closePath()
      context.fill()
    }
  }

  let render = getRender(context)

  function getBoxRender(render: Function, width: number, height: number) {
    return function boxRender(x: number, y: number, color: string): void {
      render(x, y, width, height, color)
    }
  }

  // init colors
  let colors = ['#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688']


  // get canvas origin
  let origin: Coord = {
    x: (width - boxWidth) / 2,
    y: (height - boxHeight) / 2
  }

  // 六个面的渲染顺序：
  // 1. 背面
  // 2. 右|下
  // 3. 左|上
  // 4. 正面

  let offset: Coord = {
    x: 0,
    y: 0
  }

  class BoxRender {
    config: RenderConfig
    context: any
    origin: Coord
    offset: Coord
    boxWidth: number
    boxHeight: number
    colors: Array<string>
    back: Function
    left: Function
    right: Function
    top: Function
    bottom: Function
    front: Function
    setConfig: Function
    render: Function
    update: Function

    constructor (config: RenderConfig) {
      this.setConfig(config)
    }

    setConfig (config: RenderConfig) {
      this.config = config
      this.context = config.context
      this.origin = config.origin
      this.offset = config.offset
      this.boxWidth = config.boxWidth
      this.boxHeight = config.boxHeight
      this.colors = config.colors
    }

    update (config: RenderConfig) {
      this.clean()
      this.setConfig(Object.assign({}, this.config, config))
      this.render()
    }

    clean () {
      context.canvas.width = context.canvas.width
    }

    back () {
      let {colors, origin, offset, boxWidth, boxHeight, context} = this
      let color = colors[0]
      context.moveTo(origin.x + offset.x, origin.y + offset.y)
      context.lineTo(origin.x + offset.x + boxWidth, origin.y + offset.y)
      context.lineTo(origin.x + offset.x + boxWidth, origin.y + offset.y + boxHeight)
      context.lineTo(origin.x + offset.x, origin.y + offset.y + boxHeight)

      context.fillStyle = color
    }

    right () {
      let {colors, origin, offset, boxWidth, boxHeight, context} = this
      let color = colors[1]
      context.moveTo(origin.x + boxWidth, origin.y)
      context.lineTo(origin.x + boxWidth + offset.x, origin.y + offset.y)
      context.lineTo(origin.x + boxWidth + offset.x, origin.y + boxHeight + offset.y)
      context.lineTo(origin.x + boxWidth, origin.y + boxHeight)

      context.fillStyle = color
    }

    bottom () {
      let {colors, origin, offset, boxWidth, boxHeight, context} = this
      let color = colors[2]
      context.moveTo(origin.x, origin.y + boxHeight)
      context.lineTo(origin.x + boxWidth, origin.y + boxHeight)
      context.lineTo(origin.x + boxWidth + offset.x, origin.y + boxHeight + offset.y)
      context.lineTo(origin.x + offset.x, origin.y + boxHeight + offset.y)

      context.fillStyle = color
    }

    left () {
      let {colors, origin, offset, boxWidth, boxHeight, context} = this
      let color = colors[3]
      context.moveTo(origin.x, origin.y)
      context.lineTo(origin.x + offset.x, origin.y + offset.y)
      context.lineTo(origin.x + offset.x, origin.y + boxHeight + offset.y)
      context.lineTo(origin.x, origin.y + boxHeight)

      context.fillStyle = color
    }

    top () {
      let {colors, origin, offset, boxWidth, boxHeight, context} = this
      let color = colors[4]
      context.moveTo(origin.x, origin.y)
      context.lineTo(origin.x + boxWidth, origin.y)
      context.lineTo(origin.x + boxWidth + offset.x, origin.y + offset.y)
      context.lineTo(origin.x + offset.x, origin.y + offset.y)

      context.fillStyle = color
    }

    front () {
      let {colors, origin, offset, boxWidth, boxHeight, context} = this
      let color = colors[5]
      context.moveTo(origin.x, origin.y)
      context.lineTo(origin.x + boxWidth, origin.y)
      context.lineTo(origin.x + boxWidth, origin.y + boxHeight)
      context.lineTo(origin.x, origin.y + boxHeight)

      context.fillStyle = color
    }

    render () {
      let {offset} = this

      let sort: Array<'left'|'right'|'bottom'|'top'|'front'|'back'> = ['back']

      let lefts = ['left', 'right']
      let tops = ['top', 'bottom']
      // 先渲染左，后渲染右
      sort = sort.concat(offset.x > 0 ? lefts.shift(): lefts.pop())

      // 先渲染上，后渲染下
      sort = sort.concat(offset.y > 0 ? tops.shift(): tops.pop())

      // 拼接剩余两个属性
      sort = sort.concat(lefts, tops)

      // 最后渲染front面
      sort = sort.concat('front')

      let methods: {
        back: Function,
        left: Function,
        right: Function,
        top: Function,
        bottom: Function,
        front: Function
      } = this

      // render background
      render(0, 0, width, height, 'gray')

      sort.forEach(method => {
        context.beginPath()
        methods[method]()
        context.closePath()
        context.fill()
      })
    }
  }
  let boxRender = new BoxRender({
    context,
    origin,
    offset,
    boxWidth,
    boxHeight,
    colors
  })

  let offsetTop = $canvas.offsetTop
  let offsetLeft = $canvas.offsetLeft
  let originX = $canvas.width / 2
  let originY = $canvas.height / 2
  let scale = 10
  $canvas.addEventListener('mousemove', function (e) {
    let x = e.x - offsetTop
    let y = e.y - offsetLeft

    boxRender.update({
      offset: {
        x: (originX - x) / scale,
        y: (originY - y) / scale
      }
    })
  })

  let initValue = {
    alpha: 0,
    beta: 0
  }

  let $output: HTMLElement | null = document.querySelector('#output')
  if ($output) {
    window.addEventListener("deviceorientation", function (e) {
      if (!initValue.alpha && !initValue.beta) {
        initValue.alpha = e.alpha
        initValue.beta = e.beta
      }
      $output.innerHTML = `
        alpha: ${initValue.alpha - e.alpha}<br/>
        beta: ${initValue.beta - e.beta}<br/>
      `

      let offsetX = initValue.alpha - e.alpha
      let offsetY = initValue.beta - e.beta

      boxRender.update({
        offset: {
          x: offsetX > 0 ? Math.min(offsetX, 30) : Math.max(offsetX, -30),
          y: offsetY > 0 ? Math.min(offsetY, 30) : Math.max(offsetY, -30)
        }
      })
    })
  }

  function throttle (func, interval) {
    let identify = 0
    return (...args) => {
      if (identify) return
      identify = setTimeout(() => identify = 0, interval)
      func.apply(this, args)
    }
  }

  boxRender.render()
}
