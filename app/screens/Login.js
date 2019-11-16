import React, { useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';
import { AuthSession } from 'expo';
import jwtDecode from 'jwt-decode';

const auth0ClientId = '9cew5cDoGNWj4cdOb52fuYo9CN63ZU6n';
const auth0Domain = 'https://idiary.eu.auth0.com';

function toQueryString(params) {
  return '?' + Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

export default function Login({navigation}) {

  useEffect(() => {
    checkStatus = async () => {
      const access_token = await AsyncStorage.getItem('@User:access_token');

      if(access_token !== undefined) {
        navigation.navigate('Home');
      }
    }

    checkStatus()
  },[])

  handleSuccess = async ({access_token}) => {
    try {
      await AsyncStorage.setItem('@User:access_token', access_token);
    } catch (error) {
      // Error saving data
    }
  }

  login = async () => {
    // Retrieve the redirect URL, add this to the callback URL list
    // of your Auth0 application.
    const redirectUrl = AuthSession.getRedirectUrl();
    console.log(`Redirect URL: ${redirectUrl}`);
    
    // Structure the auth parameters and URL
    const queryParams = toQueryString({
      client_id: auth0ClientId,
      redirect_uri: redirectUrl,
      audience: 'http://api.casualinc.me',
      response_type: 'token', // id_token will return a JWT token
      scope: 'openid profile email offline_access', // retrieve the user's profile
    });
    const authUrl = `${auth0Domain}/authorize` + queryParams;

    // Perform the authentication
    const response = await AuthSession.startAsync({ authUrl });
    console.log('Authentication response', response);

    if (response.type === 'success') {
      handleSuccess(response.params)
      navigation.navigate('Home');
    }
  };
  
  return (
      <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
          <TouchableOpacity onPress={this.login}style={{backgroundColor:'red'}}><Text>login</Text></TouchableOpacity>
      </View>
  );
}