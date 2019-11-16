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
  Animated
} from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

const pin1 = require('../../assets/pin1.png');
const pin2 = require('../../assets/pin2.png');

class Main extends React.Component {
  state = {
      coords: undefined,
      profile: undefined,
      POI: undefined,
      currentPOI: undefined,
      bottom: new Animated.Value(-420),
      PDP: undefined,
      coordinate: new AnimatedRegion({latitude:0,longitude:0,longitudeDelta: 0,latitudeDelta:0})
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

  onPressCallback (){
    if(this.state.bottom._value === 400)
      Animated.timing(this.state.bottom, {
        duration: 1000,
        toValue: -420
      }).start()
    else
      Animated.timing(this.state.bottom, {
        duration: 1000,
        toValue: 400
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
                                        coordinate={{latitude: marker.GpsInfo[0].Latitude, longitude: marker.GpsInfo[0].Longitude}}
                                        title={marker.Detail.en.Title}
                                        onPress={(marker) => {this.setState({currentPOI: marker}); this.onPressCallback()}}
                                        image={require('../../assets/pin1.png')}
                                      />
                                    ))}
                                    {this.state.PDP !== undefined && this.state.PDP.map((marker,i) => (
                                        <Marker
                                          key={i} 
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
        <TouchableOpacity style={styles.bottomBtn} onPress={this.addPDP}><Text style={styles.bottomBtnText}>Tap to add a report</Text></TouchableOpacity>
        <Animated.View style={{position:'absolute',bottom: this.state.bottom,width: '100%',height: 400,backgroundColor: '#FFF'}}>
          <View>
            {this.state.currentPOI !== undefined && <Text>{this.state.currentPOI.title}</Text>}
          </View>
          <Text>{this.state.currentPOI !== undefined && <Text>{this.state.currentPOI.description}</Text>}</Text>
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
  }
});
