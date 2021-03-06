import React from 'react';

import sfondo from '../../assets/Sfondo.png'
import sfondoMapButton from '../../assets/map-button.png'

import { 
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    ImageBackground,
    Image,
    Dimensions,
} from 'react-native';

const { height, width } = Dimensions.get('window');

export default function Profile({navigation}){
	
	const [classifica,setClassifica] = React.useState()
	
	async function getRank() {
		fetch('http://46.101.206.33:7080/getRanking', {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		}).then(response => response.json().then(res => {console.log(res);setClassifica(res)}))
	}
	
	React.useEffect(() => {
		getRank();
	}, [])
	
    const level = 56;
    const kilometers = 1.2;
    return (
            <ScrollView style={{flex:1}}>
                <ImageBackground source={sfondo} style={{left:-11,width:'102%',height:1152}}>
                <TouchableOpacity style={styles.topBtn} onPress={() => navigation.navigate('Home')}>
                    <ImageBackground source={sfondoMapButton} style={{width:170,height:65,alignItems:'center',justifyContent:'center'}}>
                    <Text>Map</Text>
                    </ImageBackground>
                </TouchableOpacity>

                <View style={{top:10,left:7,flexDirection: 'column',alignItems:'center', width: width}}>
                    <Image source={require('../../assets/alex.png')} style={{paddingTop:50,height:350,width:300}} resizeMode="contain"/>
                    <View style={[styles.box, {width: 336,height:110,backgroundColor:'#fff',opacity:.9,marginVertical:10}]}>
                        <Text>Axel</Text>
                        <Text>Level {Math.floor(navigation.state.params.profile.score*260/100)}</Text>
                        <View style={{borderWidth:1, borderColor:'#707070',backgroundColor:'#fff',width:260,height:12,borderRadius:10}}>
                            <View style={{borderWidth:1, borderColor:'#707070',width:navigation.state.params.profile.score*2.6, height:10,borderRadius:10,backgroundColor:'#4BC6C6'}}/>
                        </View>
                    </View>
                    <View style={infoBoxRowStyles}>
                        <View style={infoBoxStyles}>
                            <Image style={styles.icon} source={require('../../assets/icon1.png')}/>
                            <Text>{kilometers} km</Text>
                        </View>
                        <View style={infoBoxStyles}>
                            <Image style={styles.icon} source={require('../../assets/icon2.png')}/>
                            <Text>{kilometers} cal</Text>
                        </View>
                    </View>
                    <View style={infoBoxRowStyles}>
                        <View style={infoBoxStyles}>
                            <Image style={styles.icon} source={require('../../assets/icon3.png')}/>
                            <Text>{kilometers} reports</Text>
                        </View>
                        <View style={infoBoxStyles}>
                            <Image style={styles.icon} source={require('../../assets/icon4.png')}/>
                            <Text>{kilometers} actions</Text>
                        </View>
                    </View>
                </View>
                
                {classifica &&
                <View>
			{classifica.map((item, key)=><Text key={key}>{item.firstName}</Text>)}
                </View>}
            </ImageBackground>
            </ScrollView>
    )
}

const infoBoxStyles={backgroundColor:'#fff', width:160, height:110, borderRadius:15, alignItems:'center', justifyContent:'center', opacity:.9}
const infoText={fontSize:25,color:'#707070',fontFamily:'SF-Pro-Rounded-Medium'}
const infoBoxRowStyles={flexDirection:'row', paddingVertical:10, width:'100%', justifyContent:'space-evenly'}

/**
 * {false && <ImageBackground 
                style={{width,height: '100%'}}
                source={require('../../assets/Sfondo.png')}
            >}
 */

const styles = StyleSheet.create({
    topBtn: {
        borderRadius: 15,
        marginTop: 70,
        marginLeft: 30,
        width:170,
        height:65
    },
    box: {
        backgroundColor: 'rgba(256,256,256,.3)',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        width: 50,
        height: 50
    }
})