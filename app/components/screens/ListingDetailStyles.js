import { StyleSheet } from "react-native";
import * as Consts from "../../constants/styleConstants";
import { bottomBarHeight } from "../../wiloke-elements";

const styles = StyleSheet.create({
  contentWrapper: {
    padding: 10,
    backgroundColor: Consts.colorGray2,
    marginBottom: bottomBarHeight,
    minHeight: Consts.screenHeight / 1.6,
  },
  aCenter: { alignItems: "center", marginBottom: 20 },
  maxWidth: { width: Consts.screenWidth - 20 },
  button: {
    paddingVertical: 0,
    height: 50,
    justifyContent: "center",
  },
  actionWrap: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Consts.colorGray1,
    paddingVertical: 15,
    paddingBottom: 15,
    backgroundColor: "#fff",
    marginBottom: 10,
    marginTop: -10,
    marginHorizontal: -10,
  },
  headerRight: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonFooterContentBox: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 16,
    marginBottom: 10,
  },
  actionItem: {
    flexDirection: "column",
    alignItems: "center",
  },
  headerLeft: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonLargeContent: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: 50,
    borderRadius: 3,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
  cart: {
    position: "absolute",
    right: 10,
    bottom: 0,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  viewTotal: {
    position: "absolute",
    top: 5,
    right: 5,
    color: "#333",
    width: 15,
    height: 15,
    backgroundColor: "#fff",
    borderRadius: 40,
    zIndex: 99,
    alignItems: "center",
    justifyContent: "center",
  },
  textCart: {
    fontSize: 10,
    padding: 3,
    fontWeight: "bold",
  },
});
export default styles;
