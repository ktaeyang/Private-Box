import React, { useRef, useEffect } from 'react';
import { StyleSheet,Animated, Text, View } from 'react-native';

const FadeInView = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current  // Initial value for opacity: 0

  React.useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 2000,
        useNativeDriver : true,
      }
    ).start();
  }, [fadeAnim])

  return (
    <Animated.View                 // Special animatable View
      style={{
        ...props.style,
        opacity: fadeAnim,         // Bind opacity to animated value
      }}
    >
      {props.children}
    </Animated.View>
  );
}

// You can then use your `FadeInView` in place of a `View` in your components:
export default () => {

  return (
    <View style={styles.container}>
      <FadeInView style={styles.FadeInView}>
        <Text style={styles.fadeinText}>반갑습니다!</Text>
      </FadeInView>
    </View>
  )}

  const styles = StyleSheet.create({
      container : {
        flex : 1,
        alignItems : 'center',
        justifyContent : 'center',
        backgroundColor : '#fff'
      },
      FadeInView : {
          width : 250,
          height : 50,
          backgroundColor : '#fff',
      },
      fadeinText : {
          fontSize : 28,
          fontWeight : '500',
          textAlign : 'center',
          margin : 10,
      }

  })




