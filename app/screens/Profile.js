import React from 'react';
import { 
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet
} from 'react-native';

export default function Profile(){
    return (
        <ScrollView>
            <TouchableOpacity style={styles.topBtn}>
                <Text>Map</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    topBtn: {
        borderRadius: 15,
        marginTop: 70,
        marginLeft: 20,
        paddingHorizontal: 20,
        paddingTop:10
    }
})