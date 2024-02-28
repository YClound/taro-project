import { View, Text } from '@tarojs/components';
import { useLoad } from '@tarojs/taro';
import './index.less';

export default function Index() {

  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='index pl-2'>
      <Text>Hello world!</Text>
    </View>
  )
}
