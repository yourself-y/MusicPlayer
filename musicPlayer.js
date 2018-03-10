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

export default class MusicPlayer extends Component {
	constructor(props) {
	    super(props)
		this.rotation = true
	    this.state = {
	      currentIndex: 0,
		  spinValue: new Animated.Value(0),
	    }
		this.spinAnimated = Animated.timing(this.state.spinValue, {
			toValue: 1,
			duration: 6000,
			easing: Easing.inOut(Easing.linear)
    	})
	}

	spining() {
	    if (this.rotation) {
			this.state.spinValue.setValue(0)
			this.spinAnimated.start(() => {		//????
				this.spining()
			})
	    }
  	}

	spin() {
	    this.rotation = !this.rotation
	    if (this.rotation) {
			this.spinAnimated.start(() => {
		        this.spinAnimated = Animated.timing(this.state.spinValue, {
					toValue: 1,
		          	duration: 6000,
				  	easing: Easing.inOut(Easing.linear)
		        })
				this.spining()
	    	})
		} else {
			this.state.spinValue.stopAnimation((oneTimeRotate) => {
		        this.spinAnimated = Animated.timing(this.state.spinValue, {
			          toValue: 1,
			          duration: (1 - oneTimeRotate) * 6000,
			          easing: Easing.inOut(Easing.linear)
		        })
	      	})
	  	}
	}

	render() {
	    let musicInfo = mockData.list[this.state.currentIndex]
	    return (
			<View style={styles.container}>
				<View style={styles.bgContainer}>
					<View
						style={styles.djCard}>
		 			</View>
					<Image
						style={styles.bgCD}
						source={require('./img/bgCD.png')}
					/>
					<Animated.Image
						style={{
							width: 170,
					        height: 170,
					        borderRadius: 85,
					        alignSelf: 'center',
					        position: 'absolute',
							top: 235,
					        transform: [{
								rotate: this.state.spinValue.interpolate({
									inputRange: [0, 1],
									outputRange: ['0deg', '360deg']
					        	})
							}]}}
						source={{uri: musicInfo.cover}}
					/>
					<Video
						ref={'player'}
						source={{uri: musicInfo.url}}
						volume={1.0}
						paused={false}						// true代表暂停，默认为false
						repeat={false}						// 是否重复播放
						playInBackground={true}				// 当app转到后台运行的时候，播放是否暂停
						onLoadStart={() => console.info('音乐开始加载')}
						onLoad={() => console.info('音乐加载完成')}
						// onProgress={(data) => this.setTime(data)}	//进度控制，每250ms调用一次，以获取视频播放的进度
						onEnd={() => console.info('音乐播放完毕')}
						onError={() => console.info('音乐加载出错')}
						onBuffer={this.onBuffer}
						onTimedMetadata={this.onTimedMetadata}/>
				</View>
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
		width: deviceInfo.deviceWidth,
 	},
	bgCD: {
		width: 260,
		height: 260,
		alignSelf: 'center',
		position: 'absolute',
		top: 190
	},
	djCard: {
	    width: 270,
	    height: 270,
	    marginTop: 185,
	    borderColor: commonStyle.gray,
	    borderWidth: 10,
	    borderRadius: 190,
	    alignSelf: 'center',
	    opacity: 0.2
	},
})
