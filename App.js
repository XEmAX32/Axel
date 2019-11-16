import React from 'react';
import Main from './app/screens/Main';
import Profile from './app/screens/Profile';
import Place from './app/screens/Place';
import Login from './app/screens/Login';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const MainNavigator = createStackNavigator({
  Login: { screen: Login },
  Home: { screen: Main },
  Profile: { screen: Profile },
  Place: { screen: Place },
},{
  header: null,
  headerMode: 'none'
});

const App = createAppContainer(MainNavigator);

export default App;
