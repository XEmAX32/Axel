import React, {useEffect,useState} from 'react';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Image,
  Dimensions,
  AsyncStorage,
  Platform,
  Animated,
  ScrollView
} from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import HTMLView from 'react-native-htmlview';
import CloseBtn from '../../assets/CloseIcon';

const pin1 = require('../../assets/pin1.png');
const pin2 = require('../../assets/pin2.png');

class Main extends React.Component {
  state = {
      coords: undefined,
      profile: undefined,
      POI: undefined,
      currentPOI: undefined,
      poiBottom: new Animated.Value(-580),
      pdpBottom: new Animated.Value(-580),
      popTop:new Animated.Value(-500),
      PDP: undefined,
      coordinate: new AnimatedRegion({latitude:0,longitude:0,longitudeDelta: 0,latitudeDelta:0}),
    }
  
  fetchData = async () => {
    const access_token = await AsyncStorage.getItem('@User:access_token');

    fetch('http://46.101.206.33:7080/profile', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        "Authorization": 'BEARER '+access_token
      }
    }).then(response => {

      response.json().then(res => this.setState({profile: res}))
    })
  }

  addPDP = async () => {
    const access_token = await AsyncStorage.getItem('@User:access_token');
    fetch('http://46.101.206.33:7080/addPDP?gps='+this.state.coords.latitude+";"+this.state.coords.longitude, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        "Authorization": 'BEARER '+access_token
      },
    }).then(response => {

      alert('working')
    })
  }
  
  removePDP = async (Id=null) => {
	  const access_token = await AsyncStorage.getItem('@User:access_token');
	  fetch('http://46.101.206.33:7080/removePDP'+(Id?"?Id="+Id:""), {
		  method: 'GET',
	 headers: {
		 Accept: 'application/json',
	 'Content-Type': 'application/json',
	 "Authorization": 'BEARER '+access_token
	 },
	  }).then(response => {
		  
		  alert('working')
	  })
  }
  
  
  constructor() {
    super();
    this.fetchData();
    this.getLocationAsync();

  }

  componentWillUnmount() {
    this.location.remove();
  }

  addEventListener = async () => {
    this.location = await Location.watchPositionAsync(
      {
          enableHighAccuracy: true,
          distanceInterval: 1,
          timeInterval: 10000
      }, (nextProps) => {
      const duration = 500
      if (this.state.coordinate.latitude !== nextProps.coords.latitude || this.state.coordinate.longitude !== nextProps.coords.longitude) {
        //this.setState({coordinate: {latitude:nextProps.coords.latitude,longitude:nextProps.coords.longitude}})
          if (Platform.OS === 'android') {
            if (this.marker) {
              this.marker._component.animateMarkerToCoordinate(
                nextProps.coordinate,
                duration
              );
            }
          } else {
            this.state.coordinate.timing({
              ...nextProps.coords,
              duration
            }).start();
        }
      }
    })
  }

  componentDidMount() {
    this.addEventListener()
  }

  getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    let location = await Location.getCurrentPositionAsync({});
    const access_token = await AsyncStorage.getItem('@User:access_token');

    fetch('http://46.101.206.33:7080/getPOI?longitude='+location.coords.longitude+'&latitude='+location.coords.latitude).then((response) => {
      response.json().then(res => {this.setState({POI: res})})
    })
    fetch('http://46.101.206.33:7080/getPDP', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        "Authorization": 'BEARER '+access_token
      },
    }).then(response => response.json().then(res => this.setState({PDP: res})))

    this.setState({coords: {latitude: location.coords.latitude, longitude: location.coords.longitude}})
  }

  openCloseMaybe=(m)=>{
	  console.log("may")
	  this.setState({currentPDP: m,showPop:true})
	  Animated.timing(this.state.popTop, {
		  duration: 500,
		   toValue:0
	  }).start()
  }
  
  
  openPoi=(m)=>{
	  this.setState({currentPOI: m});
	Animated.timing(this.state.poiBottom, {
		duration: 500,
		toValue:0
	}).start()
  }
  
	closeViews=()=>{
		console.log("c")
		Animated.timing(this.state.poiBottom, {
			duration: 500,
			toValue: -580
		}).start()
		Animated.timing(this.state.pdpBottom, {
			duration: 500,
			toValue: -580
		}).start()
		this.setState({showPop:false});
	}
  
  openPdp=()=>{
	Animated.timing(this.state.pdpBottom, {
		duration: 500,
		toValue:0
	}).start()
  }

  render() {
    return (
      <View style={styles.container}>
      
        {this.state.coords !== undefined && <MapView 
                                    style={styles.mapStyle} 
                                    initialRegion={{
                                      latitude: this.state.coords.latitude, 
                                      longitude: this.state.coords.longitude,
                                      latitudeDelta: 0.09,
                                      longitudeDelta: 0.09
                                    }}
                                  >
                                    {this.state.POI !== undefined && this.state.POI.Items.map((marker,i) => (
                                      <Marker
                                        key={i}
                                        id={marker.Id}
                                        Title={marker.Detail.en.Title}
                                        coordinate={{latitude: marker.GpsInfo[0].Latitude, longitude: marker.GpsInfo[0].Longitude}}
                                        title={marker.Detail.en.Title}
                                        onPress={()=>this.openPoi(marker)}
                                        image={require('../../assets/pin1.png')}
                                      />
                                    ))}
                                    {this.state.PDP !== undefined && this.state.PDP.map((marker,i) => (
                                        <Marker
                                          key={i}
                                          onPress={()=>this.openCloseMaybe(marker)}
                                          id={marker.Id}
                                          coordinate={{latitude: Number(marker.gps.split(';')[0]), longitude: Number(marker.gps.split(';')[1])}}
                                          //title={marker.Detail.en.Title}
                                          image={require('../../assets/pin2.png')}
                                        />
                                    ))
                                    }
                                    <Marker.Animated
                                      ref={marker => { this.marker = marker }}
                                      coordinate={this.state.coordinate}
                                      image={require('../../assets/pin3.png')}
                                    />
                                  </MapView>
        }
        <TouchableOpacity 
          style={styles.topBtn}
          onPress={() => this.props.navigation.navigate('Profile', {profile:this.state.profile})}
        >
          <Image source={require('../../assets/alex.png')} style={{height: '100%',width:'40%'}} resizeMode="contain"/>
          <View style={styles.innerTopBtn}>
            <Text style={{color: '#29BC7E',fontSize: 25}}>Alex</Text>
            <Text style={{color: '#707070',fontSize:15}}>Level {this.state.profile && Math.floor(this.state.profile.score%10)}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBtn} onPress={()=>this.openPdp()}><Text style={styles.bottomBtnText}>Tap to add a report</Text></TouchableOpacity>
        
        <Animated.View style={{borderRadiusTopLeft: 15, borderRadiusTopRight: 15, position:'absolute',bottom: this.state.poiBottom,width:'100%',zIndex:2,height:580,backgroundColor: '#FFF'}}>
            <View style={{width:'100%',alignItems:'center',borderRadiusTopLeft: 15, borderRadiusTopRight: 15}}><TouchableOpacity onPress={this.closeViews}><CloseBtn style={{width:30,height:30}}/></TouchableOpacity></View>
          <View style={{borderRadiusTopLeft: 15, borderRadiusTopRight: 15,backgroundColor: '#29BC7E',textAlign:'center',justifyContent:'center',height:70}}>
            {this.state.currentPOI !== undefined && <Text style={{color: '#FFF',fontSize:25,fontFamily:'SF-Pro-Rounded-Medium',textAlign:"center"}}>{this.state.currentPOI.Detail.en.Title}</Text>}
          </View>
          <ScrollView style={{padding:20}}>
            {this.state.currentPOI !== undefined && <HTMLView
              value={this.state.currentPOI.Detail.en.BaseText}
              stylesheet={{p: {marginTop:-25,marginBottom:-25}}}
              style={{marginTop: 30,marginBottom:30,fontFamily:'SF-Pro-Text-Medium',fontSize:15,lineHeight:20}}
            />}
            </ScrollView>
            
        </Animated.View>
        {this.state.showPop &&
        <View style={{position:'absolute',flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#fff'}}>
		<View style={{backgroundColor:'#C64B4B',height:350,width:270,borderRadius:15,flexDirection:'column',alignItems:"center",justifyContent:"space-evenly"}}>
			<TouchableOpacity onPress={this.closeViews}>
				<CloseBtn style={{width:30,height:30}}/>
			</TouchableOpacity>
			<Text style={{fontFamily:'SF-Pro-Text-Medium',fontSize:15,color:'#fff'}}>!</Text>
			<Text style={{fontFamily:'SF-Pro-Text-Medium',fontSize:15,color:'#fff'}}>Reported zone</Text>
			<Text style={{fontFamily:'SF-Pro-Text-Medium',fontSize:15,color:'#fff',textAlign:'center',width:250}}>Be careful: remivung reports without actually solving the problem, will prevent others from saving this enviromnents</Text>
			<TouchableOpacity style={{width:160,alignItems:'center',height:70,justifyContent:"center",borderRadius:15,backgroundColor:'#fff'}} onPress={()=>{this.removePDP();this.closeViews()}}>
				<View><Text style={{color:'#C64B4B',fontSize:15,fontFamily:'SF-Pro-Rounded-Medium'}}>I'll take care of it!</Text></View>
			</TouchableOpacity>
		</View>
        </View>}
        
        <Animated.View style={{position:'absolute',bottom: this.state.pdpBottom,width: '100%',height: 400,backgroundColor: '#FFF',zIndex:2}}>
		<View style={{width:'100%',alignItems:'center',borderRadiusTopLeft: 15, borderRadiusTopRight: 15}}>
			<TouchableOpacity onPress={this.closeViews}>
				<CloseBtn style={{width:30,height:30}}/>
			</TouchableOpacity>
		</View>
			
		<View style={{flexDirection: 'row',left:20,fontFamily:'SF-Pro-Rounded-Medium',fontSize:25}}>
				<Text style={{fontWeight: 'bold', color: '#C64B4B',fontSize:25}}>Report something</Text>
		</View>
		{this.state.coords !== undefined && <Text style={{left:20,fontFamily:'SF-Pro-Text-Medium',fontSize:15,color:'#707070'}}>{this.state.coords.latitude.toFixed(4)+'°N '+this.state.coords.longitude.toFixed(4)+'°E'}</Text>}
		<View>
			<Text style={{padding:20,fontFamily:'SF-Pro-Text-Medium',fontSize:15,color:'#707070',top:30}}>If you find any issue in this area including trash, pollution, or environmental problems of any kind, let us know!
			{'\n'}You can take care of the problem by your self or report it for someone else.</Text>
			<View style={{flexDirection:'row',alignItems:'center',justifyContent:"space-evenly",top:30}}>
			<TouchableOpacity style={{width:160,alignItems:'center',height:70,justifyContent:"center",borderRadius:15,backgroundColor:'#C64B4B'}} onPress={()=>{this.removePDP();this.closeViews()}}>
				<View><Text style={{color:'#fff',fontSize:15,fontFamily:'SF-Pro-Rounded-Medium'}}>I'll take care of it!</Text></View>
			</TouchableOpacity>
			<TouchableOpacity style={{width:160,height:70,alignItems:'center',justifyContent:"center",borderRadius:15,backgroundColor:'#707070'}} onPress={()=>{this.addPDP();this.closeViews()}}>
				<View><Text style={{color:'#fff',fontSize:15,fontFamily:'SF-Pro-Rounded-Medium'}}>Just report it.</Text></View>
			</TouchableOpacity>
			</View>
		</View>
	</Animated.View>
	</View>
    );
  }
}

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  bottomBtn: {
      position: 'absolute',
      height: 60,
      width: 335,
      bottom: 80,
      backgroundColor: '#29BC7E',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 15,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 10,

      elevation: 5,
  },
  bottomBtnText: {
    color: '#FFF',
    fontSize: 15,
  },
  topBtn: {
      position: 'absolute',
      flexDirection: 'row',
      backgroundColor: '#FFF',
      top: 70,
      width:170,
      left: 20,
      borderRadius: 15,
      padding: 5,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 10,

      elevation: 5,
  },
  innerTopBtn: {
    flexDirection: 'column'
  },
  closeBtn:{
	  right:0,
	  top:3
  }
});
