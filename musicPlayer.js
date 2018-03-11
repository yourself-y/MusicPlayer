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
import Icon from 'react-native-vector-icons/MaterialIcons'

const mockData = require('./musicList.json')
const deviceInfo = {
	deviceWidth: Dimensions.get('window').width,
  // deviceHeight: Platform.OS === 'ios' ? Dimensions.get('window').height : Dimensions.get('window').height - 24
	deviceHeight: Dimensions.get('window').height,
}

const header = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
}

export default class MusicPlayer extends Component {
	constructor(props) {
	    super(props)
		// this.rotation = true
		this.musicList = []
	    this.state = {
			viewRef: null,
			like: false,
	        paused: false,
	        duration: 0.00,
	        sliderValue: 0.00,
	        currentTime: 0.00,
	        currentIndex: 0,
	        playMode: 0,
	        spinValue: new Animated.Value(0),
	        playIcon: 'pause-circle-outline',
	        playModeIcon: 'repeat',
	    }
		// this.spinAnimated = Animated.timing(this.state.spinValue, {
		// 	toValue: 1,
		// 	duration: 6000,
		// 	easing: Easing.inOut(Easing.linear)
    	// })
	}

	// spining() {
	//     if (this.rotation) {
	// 		this.state.spinValue.setValue(0)
	// 		this.spinAnimated.start(() => {		//????
	// 			this.spining()
	// 		})
	//     }
  	// }
	//
	// spin() {
	//     this.rotation = !this.rotation
	//     if (this.rotation) {
	// 		this.spinAnimated.start(() => {
	// 	        this.spinAnimated = Animated.timing(this.state.spinValue, {
	// 				toValue: 1,
	// 	          	duration: 6000,
	// 			  	easing: Easing.inOut(Easing.linear)
	// 	        })
	// 			this.spining()
	//     	})
	// 	} else {
	// 		this.state.spinValue.stopAnimation((oneTimeRotate) => {
	// 	        this.spinAnimated = Animated.timing(this.state.spinValue, {
	// 		          toValue: 1,
	// 		          duration: (1 - oneTimeRotate) * 6000,
	// 		          easing: Easing.inOut(Easing.linear)
	// 	        })
	//       	})
	//   	}
	// }

	formatMediaTime(duration) {
	    let min = Math.floor(duration / 60)
	    let second = duration - min * 60
	    min = min >= 10 ? min : '0' + min
	    second = second >= 10 ? second : '0' + second
	    return min + ':' + second
	}

	setDuration(data) {
		this.setState({
			duration: data.duration,
		})
	}

	setTime(data) {
		let sliderValue = parseInt(data.currentTime)
		this.setState({
			currentTime: data.currentTime,
			sliderValue: sliderValue,
		})
	}

	reset() {
		this.setState({
			like: false,
			sliderValue: 0.00,
			currentTime: 0.00,
		})
	}

	like() {
		this.setState({
			like: !this.state.like,
		})
	}

	download() {
		console.log('click download');
	}

	comment() {
		console.log('click comment');
	}

	more() {
		console.log('click more');
	}

	onChangeMode(playMode) {
		console.log(playMode);
		playMode = (playMode + 1) % 3
		switch (playMode) {
			case 0:
		        this.setState({playMode, playModeIcon: 'repeat'})
		        break
	      	case 1:
		        this.setState({playMode, playModeIcon: 'repeat-one'})
		        break
	      	case 2:
		        this.setState({playMode, playModeIcon: 'shuffle'})
		        break
	      	default:
	        	break
		}
	}

	preMusic() {
		this.reset()
		this.setState({
			currentIndex: (this.state.currentIndex + 1) % mockData.list.length,
		})
	}

	play() {
		this.setState({
			paused: !this.state.paused,
			playIcon: this.state.paused ? 'pause-circle-outline' : 'play-circle-outline',
		})
	}

	nextMusic() {
		this.reset()
		this.setState({
			currentIndex: (this.state.currentIndex - 1 + mockData.list.length) % mockData.list.length,
		})
	}

	openMusicList() {
		console.log('click list');
	}

	onEnd() {
		console.log('播放完毕');
		this.nextMusic()
	}

	render() {
	    let musicInfo = mockData.list[this.state.currentIndex]
	    return (
			<View style={styles.container}>
				<View style={styles.bgContainer}>
					<View style={styles.djContainer}>
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
								top: 49,
						        transform: [{
									rotate: this.state.spinValue.interpolate({
										inputRange: [0, 1],
										outputRange: ['0deg', '360deg']
						        	})
								}]}}
							source={{uri: musicInfo.cover}}
						/>
					</View>
					<View style={{flex: 1}}>
						<View style={styles.tool}>
							<TouchableOpacity onPress={() => this.like()}>
								<Icon name={'favorite'} size={25} color={this.state.like?commonStyle.red:commonStyle.white}/>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => this.download()}>
								<Icon name={'file-download'} size={25} color={commonStyle.white}/>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => this.comment()}>
								<Icon name={'chat-bubble-outline'} size={25} color={commonStyle.white}/>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => this.more()}>
								<Icon name={'more-vert'} size={25} color={commonStyle.white}/>
							</TouchableOpacity>
						</View>
						<View style={styles.progressStyle}>
							<Text style={{width: 35, fontSize: 11, color: commonStyle.white, marginLeft: 5}}>
								{this.formatMediaTime(Math.floor(this.state.currentTime))}
							</Text>
							<Slider
								ref='slider'
								style={{flex: 1}}
								value={this.state.sliderValue}
								maximumValue={this.state.duration}
								thumbTintColor={commonStyle.white}
								minimumTrackTintColor={commonStyle.themeColor}
								maximumTrackTintColor={commonStyle.iconGray}
								step={1}
								onValueChange={value => this.setState({currentTime: value})}
								onSlidingComplete={value => this.refs.video.seek(value)}//调到指定位置播放
							/>
							<View style={{width: 35, alignItems: 'flex-end', marginRight: 5}}>
								<Text style={{fontSize: 11, color: commonStyle.white}}>
									{this.formatMediaTime(Math.floor(this.state.duration))}
								</Text>
							</View>
						</View>
						<View style={styles.toolBar}>
							<TouchableOpacity onPress={() => this.onChangeMode(this.state.playMode)}>
								<Icon name={this.state.playModeIcon} size={30} color={commonStyle.white}/>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => this.preMusic()}>
								<Icon name={'skip-previous'} size={35} color={commonStyle.white}/>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => this.play()}>
								<Icon name={this.state.playIcon} size={60} color={commonStyle.white}/>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => this.nextMusic()}>
								<Icon name={'skip-next'} size={35} color={commonStyle.white}/>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => this.openMusicList()}>
								<Icon name={'playlist-play'} size={30} color={commonStyle.white}/>
							</TouchableOpacity>
						</View>
					</View>
					<Video
						ref='video'
						source={{uri: musicInfo.url}}
						volume={1.0}
						paused={this.state.paused}						// true代表暂停，默认为false
						repeat={false}						// 是否重复播放
						playInBackground={true}				// 当app转到后台运行的时候，播放是否暂停
						onLoadStart={() => console.info('音乐开始加载')}
						onLoad={data => this.setDuration(data)}
						onProgress={data => this.setTime(data)}	//进度控制，每250ms调用一次，以获取视频播放的进度
						onEnd={() => this.onEnd()}
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
		height: deviceInfo.deviceHeight,
		width: deviceInfo.deviceWidth,
		backgroundColor: commonStyle.black,
 	},
	bgCD: {
		width: 260,
		height: 260,
		alignSelf: 'center',
		position: 'absolute',
		top: 5,
	},
	djCard: {
	    width: 270,
	    height: 270,
	    borderColor: commonStyle.gray,
	    borderWidth: 10,
	    borderRadius: 190,
	    alignSelf: 'center',
	    opacity: 0.2,
	},
	djContainer: {
		top: 120,
	},
	tool: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		top: 180,
	},
	progressStyle: {
		position: 'absolute',
	    flexDirection: 'row',
	    marginHorizontal: 10,
	    alignItems: 'center',
		top: 240,
	},
	toolBar: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		top: 245,
  	},
	absolute: {
	    position: "absolute",
	    top: 0,
	    left: 0,
	    bottom: 0,
	    right: 0,
	},
})
