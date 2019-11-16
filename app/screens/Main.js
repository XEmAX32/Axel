import React, {useEffect,useState} from 'react';
import MapView, { Marker } from 'react-native-maps';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Dimensions,
  AsyncStorage 
} from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

const pin1 = require('../../assets/pin1.png');
const pin2 = require('../../assets/pin2.png');

const Main = function({navigation}){
  const [coords,setCoords] = useState();
  const [POI, setPOI] = useState();
  const [PDP, setPDP] = useState();
  const [profile, setProfile] = useState();

  const fetchData = async () => {
    const access_token = await AsyncStorage.getItem('@User:access_token');

    fetch('http://46.101.206.33:7080/profile', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        "Authorization": 'BEARER '+access_token
      }
    }).then(response => {

      response.json().then(res => setProfile(res))
    })
  }

  const addPDP = async () => {
    const access_token = await AsyncStorage.getItem('@User:access_token');
    fetch('http://46.101.206.33:7080/addPDP?gps='+coords.latitude+";"+coords.longitude, {
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
  

  useEffect(() => {
    
    fetchData();

    getLocationAsync();
  }, []);

  getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    let location = await Location.getCurrentPositionAsync({});
    const access_token = await AsyncStorage.getItem('@User:access_token');

    fetch('http://46.101.206.33:7080/getPOI?longitude='+location.coords.longitude+'&latitude='+location.coords.latitude).then((response) => {
      response.json().then(res => {setPOI(res)})
    })
    fetch('http://46.101.206.33:7080/getPDP', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        "Authorization": 'BEARER '+access_token
      },
    }).then(response => response.json().then(res => setPDP(res)))

    setCoords({latitude: location.coords.latitude, longitude: location.coords.longitude})
  }

  return (
      <View style={styles.container}>
        {coords !== undefined && <MapView 
                                    style={styles.mapStyle} 
                                    initialRegion={{
                                      latitude: coords.latitude, 
                                      longitude: coords.longitude,
                                      latitudeDelta: 0.09,
                                      longitudeDelta: 0.09
                                    }}
                                  >
                                    {POI !== undefined && POI.Items.map((marker,i) => (
                                      <Marker
                                        key={i} 
                                        coordinate={{latitude: marker.GpsInfo[0].Latitude, longitude: marker.GpsInfo[0].Longitude}}
                                        title={marker.Detail.en.Title}
                                        image={require('../../assets/pin1.png')}
                                      />
                                    ))}
                                    {PDP !== undefined && console.log({latitude: Number(PDP[0].gps.split(';')[0]), longitude: Number(PDP[0].gps.split(';')[1])})}
                                    {
                                      PDP !== undefined && PDP.map((marker,i) => {
                                        <Marker
                                          key={i} 
                                          coordinate={{latitude: Number(marker.gps.split(';')[0]), longitude: Number(marker.gps.split(';')[1])}}
                                          //title={marker.Detail.en.Title}
                                          image={require('../../assets/pin2.png')}
                                        />
                                      })
                                    }
                                  </MapView>
        }
        <TouchableOpacity 
          style={styles.topBtn}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={styles.innerTopBtn}>
            <Text style={{color: '#29BC7E',fontSize: 25}}>Axel</Text>
            <Text style={{color: '#707070',fontSize:15}}>Level {profile && profile.score}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBtn} onPress={addPDP}><Text style={styles.bottomBtnText}>Tap to add a report</Text></TouchableOpacity>
      </View>
    );
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

      backgroundColor: '#FFF',
      top: 70,
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
