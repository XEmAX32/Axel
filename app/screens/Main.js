import React from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';

const Main = function({navigation}){
  const level = 58;
    return (
      <View style={styles.container}>
        <MapView style={styles.mapStyle} />
        <TouchableOpacity 
          style={styles.topBtn}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={styles.innerTopBtn}>
            <Text style={{color: '#29BC7E',fontSize: 25}}>Axel</Text>
            <Text style={{color: '#707070',fontSize:15}}>Level {level}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBtn}><Text style={styles.bottomBtnText}>Tap to add a report</Text></TouchableOpacity>
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
