import React, { useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import * as GoogleSignIn from 'expo-google-sign-in';

export default function Login() {
    signInAsync = async () => {
        try {
          await GoogleSignIn.askForPlayServicesAsync();
          const { type, user } = await GoogleSignIn.signInAsync();
          if (type === 'success') {
            // ...
          }
        } catch ({ message }) {
          alert('login: Error:' + message);
        }
      };

    useEffect(() => {
        const start = async () => {
        try {
            await GoogleSignIn.initAsync({ clientId: '220932512200-kh5fn2vrngfkr2e9d1rgl8ti68h2f87v.apps.googleusercontent.com' });
          } catch ({ message }) {
            alert('GoogleSignIn.initAsync(): ' + message);
          }
        }
        start();
    }, [])
    return (
        <View>
            <TouchableOpacity onPress={() => signInAsync()}><Text>login</Text></TouchableOpacity>
        </View>
    );
}