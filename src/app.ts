import { Component } from 'react'
import './app.less'

class App extends Component {

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  onShareAppMessage(){
    console.log('全局分享测试')
    return {
      title: '全局分享测试'
    }
  }

  // this.props.children 是将要会渲染的页面
  render () {
    return this.props.children
  }
}

export default App
