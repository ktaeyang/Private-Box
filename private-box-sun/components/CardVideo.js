import { StyleSheet, Text, View, TouchableOpacity, Button } from "react-native";
import React, { useState, useEffect } from "react";
import IconEvil from "react-native-vector-icons/EvilIcons";
import IconAnt from "react-native-vector-icons/AntDesign";
import { Video, AVPlaybackStatus } from "expo-av";
const isIOS = Platform.OS === "ios";
import * as Application from "expo-application";
import AlertAsync from "react-native-alert-async";
import { firebase_db } from "../firebaseConfig";

export default function CardVideo({
  content,
  props,
  videoState,
  setVideoState,
  route,
  navigation,
}) {
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const [like, setLike] = useState(false);
  let userUniqueId;
  const getUserId = async () => {
    if (isIOS) {
      let iosId = await Application.getIosIdForVendorAsync();
      userUniqueId = iosId;
    } else {
      userUniqueId = await Application.androidId;
      //setUserId(userUniqueId)
    }
  };
  const delVideo = async () => {
    await getUserId();
    const textif = await AlertAsync(
      "Private Box",
      "Do you want to Delete this File?",
      [
        { text: "No", onPress: () => Promise.resolve("no") },
        { text: "Yes", onPress: () => "yes" },
      ],
      {
        cancelable: true,
        onDismiss: () => "no",
      }
    );
    if (textif === "yes") {
      firebase_db
        .ref(`user/${userUniqueId}/video/${props}`)
        .remove()
        .then(() => {
          console.log("Delete Complete.");
        });

      firebase_db
        .ref(`user/${userUniqueId}/video/`)
        .once("value")
        .then((snapshot) => {
          let temp = snapshot.val();

          if (temp === null) {
            setVideoState([]);
          } else {
            setVideoState(temp);
          }
        });
    } else {
      return;
    }
  };
  const bLike = () => {
    if (!like) {
      setLike(true);
    } else {
      setLike(false);
    }
  };
  return (
    <View style={styles.card}>
      <View style={styles.container}>
        <Video
          style={styles.video}
          source={{ uri: content.uri }} // Can be a URL or a local file.
          ref={video}
          useNativeControls
          resizeMode="contain"
          isLooping
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={() =>
              status.isPlaying
                ? video.current.pauseAsync()
                : video.current.playAsync()
            }
          >
            <IconAnt
              name={status.isPlaying ? "pause" : "caretright"}
              size={25}
              color="#aaa"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.button}>
          <TouchableOpacity style={styles.buttonContent} onPress={bLike}>
            <IconAnt
              name={like ? "heart" : "hearto"}
              size={18}
              color={like ? "#FF0000" : "#aaa"}
            ></IconAnt>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContent}>
            <IconEvil name="share-apple" size={25} color="#aaa"></IconEvil>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonRemove}
            onPress={() => delVideo()}
          >
            <IconEvil name="trash" size={25} color="#aaa"></IconEvil>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    flex: 1,
    flexDirection: "column",
    marginBottom: 10,
  },
  cardImage: {
    flex: 1,
    width: "100%",
    height: 400,
    alignSelf: "center",
    margin: 20,
  },
  button: {
    marginBottom: 20,
    flexDirection: "row",
  },
  buttonContent: {
    marginHorizontal: 5,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
  },
  video: {
    alignSelf: "center",
    width: "100%",
    height: 400,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonRemove: {
    flex: 1,
    marginRight: 10,
    alignItems: "flex-end",
  },
});
