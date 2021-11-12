import React, { PureComponent } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { withNavigationFocus } from "react-navigation";
import { connect } from "react-redux";
import {
  getListingProductAdvanced,
  addToCartListing,
  removeToCartListing,
  getProductsCart,
  isDeleteItemCart,
} from "../../actions";
import {
  ViewWithLoading,
  ContentBox,
  Toast,
  Button,
  FontIcon,
  CheckBox,
  LoadingFull,
  HtmlViewer,
  wait,
} from "../../wiloke-elements";
import _ from "lodash";
import { ProductsWC, ListingProductItemClassic } from "../dumbs";
import * as Consts from "../../constants/styleConstants";

class ListingProductContainer2 extends PureComponent {
  constructor(props) {
    super(props);
    this.focus = null;
    this.state = {
      isLoading: true,
      updated: false,
    };
  }

  _getListingProductsSimple = async () => {
    const { getListingProductAdvanced, params, type } = this.props;
    const { id, item, max } = params;
    type === null && (await getListingProductAdvanced(id, item, max));
  };

  _handleFocus = () => {
    this._getListingProductsSimple();
  };

  componentDidMount() {
    const { navigation } = this.props;
    this._getListingProductsSimple();
    navigation.addListener("didFocus", this._handleFocus);
  }

  componentWillUnmount() {
    const { navigation } = this.props;
    navigation.addListener("didBlur", this._handleFocus);
  }

  // _goToCart = () => {
  //   const { navigation } = this.props;
  //   navigation.navigate("CartScreen");
  // };

  // _goToCheckOut = () => {
  //   const { navigation, params, myCart } = this.props;
  //   if (myCart.products.length === 0) {
  //     this._showMessage(
  //       "Your cart is empty! Please add product to proceed checkout"
  //     );
  //     return;
  //   }
  //   navigation.navigate("PaymentScreen");
  // };

  _removeCart = async (item) => {
    const {
      removeToCartListing,
      getProductsCart,
      auth,
      myCart,
      params,
    } = this.props;
    const paramsProduct = {
      productID: item.ID,
      cartKey: item.cartKey,
      listingID: params.id,
    };
    await this.setState({
      [`enabled_${item.ID}`]: true,
      updated: true,
    });
    await removeToCartListing(paramsProduct);
    this.setState({
      [`enabled_${item.ID}`]: false,
    });
    await getProductsCart();
  };
  _addToCart = async (item) => {
    const {
      addToCartListing,
      getProductsCart,
      auth,
      params,
      myCart,
    } = this.props;
    const paramsProduct = {
      id: item.ID,
      quantity: 1,
      listingID: params.id,
      variant: "single_selection",
      mode: "addOne",
    };
    await this.setState({
      [`enabled_${item.ID}`]: true,
      updated: true,
    });
    await addToCartListing(paramsProduct);
    this.setState({
      [`enabled_${item.ID}`]: false,
    });
    await getProductsCart();
  };

  _handleProduct = (item) => async (_) => {
    const { navigation } = this.props;
    if (item.type === "booking") {
      WebBrowser.openBrowserAsync(item.link);
      return;
    }
    navigation.navigate("ProductDetailScreen", {
      productID: item.ID,
      oFeaturedImg: item.oFeaturedImg.large,
      name: item.title,
    });
  };

  _handleLoginScreen = () => {
    const { translations, navigation } = this.props;
    Alert.alert(translations.login, "Tu necesitas Iniciar Sesion primero", [
      {
        text: translations.cancel,
        style: "cancel",
      },
      {
        text: translations.continue,
        onPress: () => navigation.navigate("AccountScreen"),
      },
    ]);
  };

  _handleCheckItem = (item) => async () => {
    const { auth } = this.props;
    const { isLoggedIn } = auth;
    if (!isLoggedIn) {
      this._handleLoginScreen();
      return;
    }
    if (!item.isAddedToCart) {
      this._addToCart(item);
      return;
    }
    this._removeCart(item);
  };

  _showMessage = (msg) => {
    this._toast.show(msg, {
      delay: 2000,
    });
  };

  _renderProductItem = ({ item, index }) => {
    const { settings, auth, translations } = this.props;
    return (
      <TouchableOpacity
        style={{
          paddingVertical: 5,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        disabled={
          this.state[`enabled_${item.ID}`] || item.stockStatus === "outofstock"
        }
        onPress={this._handleCheckItem(item)}
      >
        <ListingProductItemClassic
          productName={item.title}
          author={item.oAuthor.displayName}
          category={item.oCategories[0]}
          salePrice={item.salePrice}
          salePriceHtml={item.salePriceHtml}
          priceHtml={item.regularPriceHTML}
          onPress={this._handleProduct(item)}
          status={item.stockStatus}
          src={item.oFeaturedImg.thumbnail}
          colorPrimary={settings.colorPrimary}
          statusText={translations.outOfStock}
        />
        {this._renderCheckBox(item)}
      </TouchableOpacity>
    );
  };

  _renderHeaderList = (item, index) => () => {
    if (!item.heading) return null;

    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text style={styles.heading}>{item.heading}</Text>
        <HtmlViewer
          html={item.description}
          htmlWrapCssString={`text-align:center;`}
          containerStyle={{ marginBottom: 5, paddingHorizontal: 20 }}
        />
      </View>
    );
  };

  _renderCheckBox = (item) => {
    const { auth } = this.props;
    return (
      <View>
        {!!this.state[`enabled_${item.ID}`] ? (
          <ActivityIndicator size="small" color="#333" />
        ) : item.stockStatus !== "outofstock" ? (
          <CheckBox
            checked={auth.isLoggedIn && item.isAddedToCart}
            size={22}
            borderWidth={1}
            radius={100}
            name="checkbox"
            circleAnimatedSize={0}
            disabled={true}
            style={{ opacity: 1 }}
          />
        ) : null}
      </View>
    );
  };

  _renderItem = (length) => (item, index) => {
    return (
      <FlatList
        data={item.products}
        key={item.vueID}
        keyExtractor={(item2, index) => item2.ID.toString()}
        renderItem={this._renderProductItem}
        ItemSeparatorComponent={() => {
          return (
            <View
              style={{
                width: "100%",
                height: 1,
                backgroundColor: Consts.colorGray1,
              }}
            />
          );
        }}
        ListHeaderComponent={this._renderHeaderList(item, index)}
        style={
          length > 1 && {
            borderBottomWidth: 1,
            borderBottomColor: Consts.colorGray1,
          }
        }
      />
    );
  };

  _renderContent = (id, item, isLoading, listingSingleProducts) => {
    const { translations, settings, navigation } = this.props;
    const { isCartLoading } = this.state;
    if (listingSingleProducts === "__empty__" || !listingSingleProducts) {
      return null;
    }
    return (
      <ViewWithLoading isLoading={isLoading} contentLoader="contentHeader">
        {!_.isEmpty(listingSingleProducts) ? (
          <ContentBox
            headerTitle={item.name}
            headerIcon={item.icon}
            style={{
              marginBottom: 10,
              width: "100%",
              marginTop: 15,
            }}
            colorPrimary={settings.colorPrimary}
            // renderFooter={this._renderFooter}
          >
            {listingSingleProducts.map(
              this._renderItem(listingSingleProducts.length)
            )}
            <Toast ref={(ref) => (this._toast = ref)} />
          </ContentBox>
        ) : null}
      </ViewWithLoading>
    );
  };

  // _renderFooter = () => {
  //   const { translations, settings } = this.props;
  //   return (
  //     <View
  //       style={{
  //         flexDirection: "row",
  //         justifyContent: "center",
  //         alignItems: "center",
  //       }}
  //     >
  //       <Button
  //         size="md"
  //         title={translations.myCart}
  //         onPress={this._goToCart}
  //         backgroundColor="secondary"
  //         textStyle={{ color: "#fff", paddingLeft: 4 }}
  //         radius="round"
  //         style={{ marginHorizontal: 7 }}
  //         renderBeforeText={() => (
  //           <FontIcon name="shopping-cart" size={20} color="#fff" />
  //         )}
  //       />
  //       <Button
  //         size="md"
  //         title={translations.proceedToCheckout}
  //         onPress={this._goToCheckOut}
  //         backgroundColor="primary"
  //         colorPrimary={settings.colorPrimary}
  //         textStyle={{ color: "#fff", paddingLeft: 4 }}
  //         radius="round"
  //         renderBeforeText={() => (
  //           <FontIcon name="credit-card" size={20} color="#fff" />
  //         )}
  //       />
  //     </View>
  //   );
  // };

  render() {
    const { params, listingSingleProduct } = this.props;
    const { id, item } = params;
    const listingID = `${id}_details`;
    return this._renderContent(
      id,
      item,
      _.isEmpty(listingSingleProduct[listingID]),
      listingSingleProduct[listingID]
    );
  }
}
const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
  },
});

const mapStateToProps = (state) => ({
  translations: state.translations,
  settings: state.settings,
  listingSingleProduct: state.listingAdvancedSingleProduct,
  auth: state.auth,
  myCart: state.cartReducer,
});
const mapDispatchToProps = {
  getListingProductAdvanced,
  addToCartListing,
  removeToCartListing,
  getProductsCart,
};

export default withNavigationFocus(
  connect(mapStateToProps, mapDispatchToProps)(ListingProductContainer2)
);
