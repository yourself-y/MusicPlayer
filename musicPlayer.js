import React, { Component } from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Image,
	Slider,
	StatusBar,
	Animated,
	Easing,
	Platform,
	findNodeHandle,
	Dimensions
} from 'react-native'
import { commonStyle } from './commonStyle'
import Video from 'react-native-video'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { BlurView, VibrancyView } from 'react-native-blur'

const mockData = require('./musicList.json')
const deviceInfo = {
	deviceWidth: Dimensions.get('window').width,
	deviceHeight: Dimensions.get('window').height,
}

const header = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
}

export default class MusicPlayer extends Component {
	constructor(props) {
	    super(props)
		this.rotation = false
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
			musicInfo: {},
	    }
		this.spinAnimated = Animated.timing(this.state.spinValue, {
			toValue: 1,
			duration: 50000,
			easing: Easing.inOut(Easing.linear)
    	})
	}

	spining() {
	    if (this.rotation) {
			this.state.spinValue.setValue(0)
			this.spinAnimated.start(() => {
				this.spining()		//finished后的回调函数，一直旋转
			})
	    }
  	}

	spin() {
	    this.rotation = !this.rotation
	    if (this.rotation) {
			this.spinAnimated.start(() => {
		        this.spinAnimated = Animated.timing(this.state.spinValue, {
					toValue: 1,
		          	duration: 50000,
				  	easing: Easing.inOut(Easing.linear)
		        })
				this.spining()
	    	})
		} else {
			this.state.spinValue.stopAnimation((oneTimeRotate) => {
		        this.spinAnimated = Animated.timing(this.state.spinValue, {
			          toValue: 1,
			          duration: (1 - oneTimeRotate) * 50000,
			          easing: Easing.inOut(Easing.linear)
		        })
	      	})
	  	}
	}

	componentWillMount() {
	    this.spin()
	    this.setState({musicInfo: mockData.list[this.state.currentIndex]})
	}

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
			musicInfo: {},
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
			currentIndex: (this.state.currentIndex - 1 + mockData.list.length) % mockData.list.length,
		})
	}

	play() {
		this.spin()
		this.setState({
			paused: !this.state.paused,
			playIcon: this.state.paused ? 'pause-circle-outline' : 'play-circle-outline',
		})
	}

	nextMusic(currentIndex) {
		this.reset()
		this.setState({
			currentIndex: currentIndex
		})
	}

	openMusicList() {
		console.log('click list');
	}

	onProgress(data) {
		this.setTime(data)
		if (parseInt(this.state.currentTime) == parseInt(this.state.duration)) {
			switch (this.state.playMode) {
				case 0:
					this.nextMusic((this.state.currentIndex + 1) % mockData.list.length)
					break
				case 1:
					//已经是单曲循环
					break
				case 2:
					this.nextMusic(Math.floor(Math.random() * mockData.list.length))
					break
				default:
					break
			}
		}
	}

	renderPlayer() {
	    let musicInfo = mockData.list[this.state.currentIndex]
	    return (
			<View style={styles.container}>
				<StatusBar
					translucent={true}
					backgroundColor='transparent'
	   	 		/>
				<View style={styles.bgContainer}>
					<View style={styles.navBarStyle}>
	  					<View style={styles.navBarContent}>
							<TouchableOpacity onPress={() => alert('pop')}>
		  						<Icon name={'arrow-back'} size={25} color={commonStyle.white}/>
							</TouchableOpacity>
							<View style={{alignItems: 'center'}}>
		  						<Text style={styles.title}>{musicInfo.title}</Text>
		  						<Text style={styles.subTitle}>子标题</Text>
							</View>
							<TouchableOpacity  onPress={() => alert('分享')}>
		  						<Icon name={'share'} size={25} color={commonStyle.white}/>
							</TouchableOpacity>
	  					</View>
					</View>
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
								top: 46,
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
							<TouchableOpacity onPress={() => this.nextMusic((this.state.currentIndex + 1) % mockData.list.length)}>
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
						repeat={true}						// 是否重复播放
						playInBackground={true}				// 当app转到后台运行的时候，播放是否暂停
						onLoadStart={this.loadStart}
						onLoad={data => this.setDuration(data)}
						onProgress={(data) => this.onProgress(data)}	//进度控制，每250ms调用一次，以获取视频播放的进度
						onEnd={() => this.onEnd()}
						onError={() => console.info('音乐加载出错')}
						onBuffer={this.onBuffer}
						onTimedMetadata={this.onTimedMetadata}/>
				</View>
			</View>
		)
	}

	imageLoaded() {
    	this.setState({ viewRef: findNodeHandle(this.backgroundImage) });
  	}

	render() {
		const data = mockData.list[this.state.currentIndex]
		return (
      		data.url ?
				<View style={styles.container}>
		          	<Image
			            ref={(img) => { this.backgroundImage = img}}
			            style={styles.bgContainer}
			            source={{uri: data.cover}}
			            resizeMode='cover'
			            onLoadEnd={() => this.imageLoaded()}
		          	/>
	                <BlurView
	                  style={styles.absolute}
	                  viewRef={this.state.viewRef}
	                  blurType="dark"
	                  blurAmount={10}
	                />
				{this.renderPlayer()}
		        </View> : <View/>
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
 	},
	navBarStyle: {
	    position: 'absolute',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'stretch',
	    width: deviceInfo.deviceWidth,
	    height: 56,
		top: 16,
	    borderBottomWidth: 0.5,
	    borderColor: commonStyle.lineColor
  	},
  	navBarContent: {
	    flexDirection: 'row',
	    alignItems: 'center',
	    justifyContent: 'space-between',
	    marginHorizontal: 16,
	},
	title: {
	    color: commonStyle.white,
	    fontSize: 14
  	},
  	subTitle: {
	    color: commonStyle.white,
	    fontSize: 11,
	    marginTop: 5
  	},
	bgCD: {
		width: 260,
		height: 260,
		alignSelf: 'center',
		position: 'absolute',
	},
	djCard: {
	    width: 260,
	    height: 260,
	    borderColor: commonStyle.gray,
	    borderWidth: 6,
	    borderRadius: 190,
	    alignSelf: 'center',
	    opacity: 0.1,
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
