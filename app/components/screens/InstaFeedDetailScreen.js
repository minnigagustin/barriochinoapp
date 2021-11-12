import React from "react";
import { StatusBar } from "react-native";
import { InstaContent } from "wil-rn-instafeed";

export default function InstaFeedDetailScreen({ navigation }) {
  const { params } = navigation.state;
  return (
    <>
      <StatusBar hidden />
      <InstaContent useNavigation navigation={navigation} {...params} />
    </>
  );
}
