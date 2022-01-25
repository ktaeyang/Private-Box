import { StyleSheet, Text, View, TouchableOpacity, Share, Image, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import IconEvil from 'react-native-vector-icons/EvilIcons'
import IconAnt from 'react-native-vector-icons/AntDesign'
const isIOS = Platform.OS === 'ios'
import * as Application from 'expo-application';
import AlertAsync from 'react-native-alert-async';
import { firebase_db } from "../firebaseConfig";

export default function CardDocument({ content, props, docState, setDocState, route, navigation }) {
  const [like, setLike] = useState(false)
  let userUniqueId;
  const getUserId = async () => {
    if (isIOS) {
      let iosId = await Application.getIosIdForVendorAsync();
      userUniqueId = iosId
    } else {
      userUniqueId = await Application.androidId
      //setUserId(userUniqueId)
    }
  }
  const bLike = () => {
    if (!like) {
      setLike(true)
    }
    else {
      setLike(false)
    }
  }
  const delDoc = async () => {
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
      firebase_db.ref(`user/${userUniqueId}/documents/${props}`).remove().then(() => {
        console.log('Delete Complete.')
      })
      firebase_db.ref(`user/${userUniqueId}/documents/`).once('value').then(snapshot => {
        let temp = snapshot.val();

        if (temp === null) {
          setDocState([]);
        }
        else {
          setDocState(temp);
        }
      })
    }

    else { return }

  }
  return (
    <View style={styles.card}>
      <TouchableOpacity>
        <View style={styles.cardImage}>
          <Text style={styles.docText} numberOfLines={1}> {content.name} </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.button}>
        <TouchableOpacity style={styles.buttonContent} onPress={bLike}><IconAnt name={like ? 'hearto' : 'heart'} size={18} color={like ? "#aaa" : "#FF0000"}></IconAnt></TouchableOpacity>
        <TouchableOpacity style={styles.buttonContent}><IconEvil name='share-apple' size={25} color="#aaa"></IconEvil></TouchableOpacity>
        <TouchableOpacity style={styles.buttonContent} onPress={() => delDoc()}><IconEvil name='trash' size={25} color="#aaa"></IconEvil></TouchableOpacity>
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
  cardImage: {
    flex: 1,
    width: '100%',
    height: 50,
    alignSelf: 'center',
    margin: 20,
  },
  button: {
    marginBottom: 20,
    flexDirection: 'row',
  },
  buttonContent: {
    marginHorizontal: 5,
  },
  docText: {
    color: '#000',
    marginLeft: 7,
    fontWeight: 'bold',
    fontSize: 16

  },

});