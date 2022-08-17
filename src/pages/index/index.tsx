import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import './index.less'

export default class Index extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onShareAppMessage() {
    console.log('33333333333');
    return {
      title: '首页分享'
    }
  }

  render () {
    return (
      <View className='index'>
        <Text>Hello world!</Text>
      </View>
    )
  }
}
