import React, { Component } from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Image,
	Slider,
	Animated,
	Easing,
	Platform,
	findNodeHandle,
	Dimensions
} from 'react-native'
import { commonStyle } from './commonStyle'
import Video from 'react-native-video'

const mockData = require('./musicList.json')
const deviceInfo = {
  deviceWidth: Dimensions.get('window').width,
  deviceHeight: Platform.OS === 'ios' ? Dimensions.get('window').height : Dimensions.get('window').height - 24
}

const header = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
}

const musicListUrl = 'http://v3.wufazhuce.com:8000/api/music/bymonth/2017-10'
const musicDetail = 'http://xiamirun.avosapps.com/run?song=http://www.xiami.com/song/'

export default class MusicPlayer extends Component {
	render() {
		return (
			<View style={styles.container}>
				<Image
					style={styles.bgCD}
					source={require('./img/bgCD.png')}
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'transparent',
	},
	bgContainer: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		height: deviceInfo.deviceHeight,
		width: deviceInfo.deviceWidth
 	},
	bgCD: {
		width: 260,
		height: 260,
		alignSelf: 'center',
		position: 'absolute',
		top: 190
	},
})
