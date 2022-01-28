import { StyleSheet, Text, View, TouchableOpacity, Dimensions , Image, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import IconEvil from 'react-native-vector-icons/EvilIcons'
import IconAnt from 'react-native-vector-icons/AntDesign'
const isIOS = Platform.OS === 'ios'
import * as Application from 'expo-application';
import AlertAsync from 'react-native-alert-async';
import { firebase_db } from "../firebaseConfig";
import ImageModal from 'react-native-image-modal';

export default function Card({ content, props, cardState, setCardState, route, navigation }) {
  const [like,setLike] = useState([false])
  let imageWidth = Dimensions.get('window').width;
  let userUniqueId; // 안드로이드 or IOS userID 를 담을 변수
  const getUserId = async () => {
    if (isIOS) {
      let iosId = await Application.getIosIdForVendorAsync();
      userUniqueId = iosId
    } else {
      userUniqueId = await Application.androidId
    }
  }
  const delImage = async () => {
    await getUserId();
    const textif = await AlertAsync(
      "Private Box",
      "Do you want to Delete this File?",
      [
        { text: 'No', onPress: () => Promise.resolve('no') },
        { text: 'Yes', onPress: () => 'yes' },
      ],
      {
        cancelable: true,
        onDismiss: () => 'no',
      })
    if (textif === 'yes') {
      firebase_db.ref(`user/${userUniqueId}/images/${props}`).remove().then(() => {
        console.log('Delete Complete.')
      })

      firebase_db.ref(`user/${userUniqueId}/images/`).once('value').then(snapshot => {
        let temp = snapshot.val();

        if (temp === null) {
          setCardState([]);
        }
        else {
          setCardState(temp);
        }
      })
    }
    else { return }

  }
  const bLike = () => {
    if (!like){
      setLike(true)
    }
    else {
      setLike(false)
    }
  }
  return (
    <View style={styles.card}>
        <ImageModal 
        swipeToDismiss={false}
        resizeMode="contain"
        imageBackgroundColor="#000000"
        style={{
          width: imageWidth,
          height: 300,
        }}
        source={{ uri: content.uri }} 
        onTap={() => console.log('onTap')} />
      <View style={styles.button}>
        <TouchableOpacity style={styles.buttonContent} onPress={bLike}><IconAnt name={like? 'hearto':'heart'} size={18} color={like? "#aaa" : "#FF0000"}></IconAnt></TouchableOpacity>
        <TouchableOpacity style={styles.buttonContent}><IconEvil name='share-apple' size={25} color="#aaa"></IconEvil></TouchableOpacity>
        <TouchableOpacity style={styles.buttonRemove} onPress={() => delImage()}><IconEvil name='trash' size={25} color="#aaa"></IconEvil></TouchableOpacity>
      </View>

    </View>

  );
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: "column",
    marginBottom: 10,
  },
  button: {
    marginVertical : 20,
    marginBottom: 20,
    flexDirection: 'row',
  },
  buttonContent: {
    marginHorizontal: 10,
  },
  buttonRemove: {
    flex : 1,
    marginRight : 10,
    alignItems : 'flex-end'
  },
});