import React, { PureComponent } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { connect } from "react-redux";
import _ from "lodash";
import {
  getListingProductAdvanced,
  changeQuantityListing,
  addToCartListing,
  deductToCartListing,
  getProductsCart,
} from "../../actions";
import {
  ViewWithLoading,
  ContentBox,
  FontIcon,
  Toast,
  HtmlViewer,
} from "../../wiloke-elements";
import * as WebBrowser from "expo-web-browser";
import * as Consts from "../../constants/styleConstants";
import {
  ProductsWC,
  ListingProductClassic,
  ListingProductItemClassic,
} from "../dumbs";
import { Feather } from "@expo/vector-icons";

class ListingProductMultiple extends PureComponent {
  state = {
    isLoading: true,
    cart: {},
  };

  _getListingProducts = async () => {
    const {
      getListingProductAdvanced,
      params,
      type,
      listingProducts,
      listingProductsAll,
    } = this.props;
    const { id, item, max } = params;
    await this.setState({
      isLoading: true,
    });
    type === null && (await getListingProductAdvanced(id, item, max));
    this.setState({
      isLoading: false,
    });
  };

  componentDidMount() {
    const { navigation } = this.props;
    this._getListingProducts();
    // this.focusListener = navigation.addListener("didFocus", () => {
    //   this._getListingProducts();
    // });
  }

  componentWillUnmount() {
    // this.focusListener.remove();
  }

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

  _handleIncrease = (item) => async () => {
    const { changeQuantityListing, params } = this.props;
    const { id: listingID } = params;
    const { cart } = this.state;
    await changeQuantityListing({
      productID: item.ID,
      quantity: 1,
      listingID,
      type: "button",
    });
    this._setProductCart(item, "add");
  };

  _handleDecrease = (item) => async () => {
    const { changeQuantityListing, params } = this.props;
    const { id: listingID } = params;
    if (item.quantity <= 0) return;
    await changeQuantityListing({
      productID: item.ID,
      quantity: -1,
      listingID,
      type: "button",
    });
    this._setProductCart(item, "subtract");
  };

  _setProductCart = _.debounce(async (item, action) => {
    const { auth, params, getProductsCart } = this.props;
    const { isLoggedIn } = auth;
    const { id: listingID } = params;
    if (!isLoggedIn) {
      this._handleLoginScreen();
      return;
    }
    const { listingProductMultiple } = this.props;
    const productItem = listingProductMultiple[`${listingID}_details`].filter(
      (i) => {
        return i.products.filter((p) => p.ID === item.ID).length > 0;
      }
    )[0];
    const productSelected = productItem.products.reduce((obj, p) => {
      if (p.ID === item.ID) {
        return {
          ...obj,
          [item.ID]: p.quantity,
        };
      }
      return obj;
    }, {});

    await this.setState((prevState) => ({
      cart: { ...prevState.cart, ...productSelected },
    }));
    if (action === "add") {
      await this._addToCartListing(item);
    } else {
      await this._deductToCartListing(item);
    }
    await getProductsCart();
  }, 1000);

  _addToCartListing = async (item) => {
    const { cart } = this.state;
    const { addToCartListing } = this.props;
    const params = {
      id: item.ID,
      quantity: cart[item.ID],
      variant: "multiple_selection",
      mode: "specifyQuantity",
    };
    await this.setState({
      [`enabled_${item.ID}`]: true,
    });
    await addToCartListing(params);
    await this.setState({
      [`enabled_${item.ID}`]: false,
    });
  };

  _deductToCartListing = async (item) => {
    const { cart } = this.state;
    const { deductToCartListing } = this.props;
    const params = {
      id: item.ID,
      quantity: cart[item.ID],
    };
    await this.setState({
      [`enabled_${item.ID}`]: true,
    });
    await deductToCartListing(params);
    await this.setState({
      [`enabled_${item.ID}`]: false,
    });
  };

  _handleChangeText = (item) => async (text) => {
    const { params, changeQuantityListing } = this.props;
    const { id: listingID } = params;
    const paramProduct = {
      productID: item.ID,
      quantity: Number(text),
      listingID,
      type: "input",
    };
    await changeQuantityListing(paramProduct);
  };
  _handleSubmitEditing = (item) => () => {
    const { addToCartListing } = this.props;
    this._setProductCart(item, "add");
  };

  _handleProduct = (item) => async () => {
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

  _renderProductItem = ({ item, index }) => {
    const { settings, translations } = this.props;
    return (
      <View style={styles.productItems}>
        <TouchableOpacity
          style={{
            maxWidth: "70%",
          }}
          onPress={this._handleProduct(item)}
        >
          <ListingProductItemClassic
            productName={item.title}
            author={item.oAuthor.displayName}
            category={item.oCategories[0]}
            salePrice={item.salePrice}
            salePriceHtml={item.salePriceHTML}
            priceHtml={item.regularPriceHTML}
            src={item.oFeaturedImg.thumbnail}
            colorPrimary={settings.colorPrimary}
            status={item.stockStatus}
            statusText={translations.outOfStock}
          />
        </TouchableOpacity>
        {!!this.state[`enabled_${item.ID}`] ? (
          <ActivityIndicator size="small" color="#333" />
        ) : item.stockStatus !== "outofstock" ? (
          this._renderAdd(item)
        ) : null}
      </View>
    );
  };

  _renderAdd = (item) => {
    const { settings } = this.props;
    return (
      <View style={styles.quantity}>
        <TouchableOpacity
          style={styles.add}
          onPress={this._handleDecrease(item)}
        >
          <FontIcon
            name="minus-circle"
            size={20}
            color={settings.colorPrimary}
          />
        </TouchableOpacity>
        <TextInput
          value={item.quantity + ""}
          defaultValue={item.quantity + ""}
          style={styles.input}
          underlineColorAndroid="transparent"
          keyboardType="numbers-and-punctuation"
          returnKeyType="go"
          onChangeText={this._handleChangeText(item)}
          onSubmitEditing={this._handleSubmitEditing(item)}
        />
        <TouchableOpacity
          style={styles.add}
          onPress={this._handleIncrease(item)}
        >
          <FontIcon
            name="plus-circle"
            size={20}
            color={settings.colorPrimary}
          />
        </TouchableOpacity>
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

  _renderContent = (id, item, isLoading, products) => {
    const { translations, settings, navigation } = this.props;
    if (products === "__empty__") {
      return null;
    }
    return (
      <ViewWithLoading isLoading={isLoading} contentLoader="contentHeader">
        {!_.isEmpty(products) ? (
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
            {products.map(this._renderItem(products.length))}
            <Toast ref={(ref) => (this._toast = ref)} />
          </ContentBox>
        ) : null}
      </ViewWithLoading>
    );
  };

  render() {
    const { params, listingProductMultiple } = this.props;
    const { id, item } = params;
    const listingID = `${id}_details`;
    return this._renderContent(
      id,
      item,
      _.isEmpty(listingProductMultiple[listingID]),
      listingProductMultiple[listingID]
    );
  }
}
const mapStateToProps = (state) => ({
  translations: state.translations,
  settings: state.settings,
  listingProductMultiple: state.listingAdvancedMultipleProducts,
  myCart: state.cartReducer,
  auth: state.auth,
});
const mapDispatchToProps = {
  getListingProductAdvanced,
  changeQuantityListing,
  addToCartListing,
  deductToCartListing,
  getProductsCart,
};
const styles = StyleSheet.create({
  productItems: {
    paddingVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    fontSize: 13,
    padding: 5,
    textAlign: "center",
  },
  add: {
    padding: 5,
  },
  quantity: {
    flexDirection: "row",
    alignItems: "center",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListingProductMultiple);
