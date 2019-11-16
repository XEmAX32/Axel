import React from 'react';
import Main from './app/screens/Main';
import Profile from './app/screens/Profile';
import Place from './app/screens/Place';
import Login from './app/screens/Login';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';

function cacheImages(images) {
	return images.map(image => {
		if (typeof image === 'string') {
			return Image.prefetch(image);
		} else {
			return Asset.fromModule(image).downloadAsync();
		}
	});
}

function cacheFonts(fonts) {
	return fonts.map(font => Font.loadAsync(font));
}

const MainNavigator = createStackNavigator({
  Login: { screen: Login },
  Home: { screen: Main },
  Profile: { screen: Profile },
  Place: { screen: Place }, 

},{
  header: null,
  headerMode: 'none'
});

const AppRouterContainer = createAppContainer(MainNavigator);

class App extends React.Component {
	
	state = {
		loading: true
  }

	async _loadAssetsAsync() {
		const imageAssets = cacheImages([
		  require('./assets/Sfondo.png'),
		  require('./assets/alex.png'),
		  require('./assets/icon1.png'),
		  require('./assets/icon2.png'),
		  require('./assets/icon3.png'),
		  require('./assets/icon4.png'),
		  require('./assets/map-button.png'),
		  require('./assets/pin1.png'),
		  require('./assets/pin2.png'),
		  require('./assets/pin3.png')

		]);
	
		const fontAssets = cacheFonts([{
       'SF-Pro-Rounded-Bold': require('./assets/SF-Pro-Rounded-Bold.otf'),
       'SF-Pro-Rounded-Medium': require('./assets/SF-Pro-Rounded-Medium.otf'),
       'SF-Pro-Text-Medium': require('./assets/SF-Pro-Text-Medium.otf'),
       'SF-Pro-Rounded-Bold': require('./assets/SF-Pro-Text-Semibold.otf'),
		}]);
  
		await Promise.all([...imageAssets, ...fontAssets]);
	}

	render(){
		if(this.state.loading) {
			return (
				<AppLoading
					startAsync={this._loadAssetsAsync}
					onFinish={() => this.setState({ loading: false })}
					onError={console.warn}
				/>
			)
		} else {
			return (
				<AppRouterContainer />
			);
		}
	}
}


export default App;
