import React, { useEffect,useState } from 'react';
import { TextInput, StyleSheet, View, Text, TouchableOpacity,Alert } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { StatusBar } from 'expo-status-bar';

export default function WritePage(props) {
    let input = '';
    const saveUserInput = (userInput) => {
      input = userInput
    }
    let date = new Date().getDate()
    let month = new Date().getMonth() + 1
    let year = new Date().getFullYear()
   
    useEffect(() => {
        props.navigation.setOptions({
            title : year + '년 ' + month + '월 ' + date + '일',
            headerRight: () => (
                <View style = {styles.headerRight}>
                <TouchableOpacity onPress={() => writeText()}><Icon name="check" size={24} color="#000" style = {styles.btnicon}/></TouchableOpacity>
                </View>
              ),
              
        })
    }, []);
    const writeText = () => {
      Alert.alert(input)
      //props.navigation.goBack()
    }
    return (
      <View style={styles.container}>
        <View style={styles.bodyContainer}>
          <TextInput
            style={styles.textInput}
            onChangeText={userInput => saveUserInput(userInput)}
            placeholder="텍스트를 입력해주세요."
            multiline={true}
          />
        </View>
        <StatusBar style='light' />
      </View>
      
    );

    
  }

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      flex: 1,
    },
    bodyContainer: {
      backgroundColor: '#fff',
      paddingHorizontal: 20,
      flex: 1
    },
    textInput: {
      marginTop: 5,
      height: 40,
      fontWeight : '500',
      fontSize : 16,
    },
    showText: {
      marginTop: 10,
      fontSize: 25,
    },
    headerRight : {
        alignItems : 'flex-start',
        flexDirection : 'row',
    },
    btnicon :{
        marginRight : 10,
        marginLeft : 5,
    },
  })