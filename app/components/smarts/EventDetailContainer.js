import React, { PureComponent } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { getEventDetail, resetEventDiscussion } from "../../actions";
import {
  WebItem,
  PhoneItem,
  AddressItem,
  ListingProductClassic,
} from "../dumbs";
import {
  isEmpty,
  ViewWithLoading,
  IconTextMedium,
  ContentBox,
  Admob,
  wait,
  Row,
  Col,
  Video,
  HtmlViewer,
  RTL,
} from "../../wiloke-elements";
import * as Consts from "../../constants/styleConstants";
import stylesBase from "../../stylesBase";
import _ from "lodash";
import he from "he";

class EventDetailContainer extends PureComponent {
  state = {
    isLoading: true,
  };

  _getEventDetail = async () => {
    try {
      const { navigation } = this.props;
      const { params } = navigation.state;
      await this.props.getEventDetail(params.id);
      this.setState({ isLoading: false });
    } catch (err) {
      console.log(err);
    }
  };

  async componentDidMount() {
    await this._getEventDetail();
  }

  componentWillUnmount() {
    this.props.resetEventDiscussion();
  }

  _handleTerm = (cat) => () => {
    const { navigation } = this.props;
    const _results = {
      postType: "event",
      listing_location: `${cat.ID}`,
    };
    navigation.navigate("EventSearchResultScreen", { _results });
  };

  renderMetaMap = (item, index) => {
    const { navigation } = this.props;
    return (
      <View key={index.toString()} style={styles.item}>
        <AddressItem
          address={item.value}
          navigation={navigation}
          iconColor={Consts.colorDark2}
          iconBackgroundColor={Consts.colorGray2}
        />
      </View>
    );
  };

  renderMetaTerm = (item, index) => {
    return (
      <View
        key={index.toString()}
        style={[
          styles.item,
          {
            paddingVertical: 4,
            flexDirection: "row",
          },
        ]}
      >
        {item.value.map((cat) => {
          return (
            <View
              key={cat.ID.toString()}
              style={{
                flexDirection: "row",
                marginVertical: 4,
                marginRight: 15,
              }}
            >
              <TouchableOpacity onPress={this._handleTerm(cat)}>
                <IconTextMedium
                  iconName="folder"
                  iconSize={30}
                  text={cat.name}
                />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  };

  renderMetaWebsite = (item, index) => {
    const { navigation } = this.props;
    return (
      <View key={index.toString()} style={styles.item}>
        <WebItem
          url={item.link}
          navigation={navigation}
          iconColor={Consts.colorDark2}
          iconBackgroundColor={Consts.colorGray2}
        />
      </View>
    );
  };

  renderMetaPhone = (item, index) => {
    return (
      <View key={index.toString()} style={styles.item}>
        <PhoneItem
          phone={item.value}
          iconColor={Consts.colorDark2}
          iconBackgroundColor={Consts.colorGray2}
        />
      </View>
    );
  };

  renderMetaEmail = (item, index) => {
    return (
      <View key={index.toString()} style={styles.item}>
        <IconTextMedium iconName={item.icon} iconSize={30} text={item.value} />
      </View>
    );
  };

  renderSinglePrice = (item, index) => {
    return (
      <View key={index.toString()} style={styles.item}>
        <IconTextMedium iconName={item.icon} iconSize={30} text={item.value} />
      </View>
    );
  };

  renderMeta = (item, index) => {
    switch (item.type) {
      case "map":
        return this.renderMetaMap(item, index);
      case "term":
        return this.renderMetaTerm(item, index);
      case "website":
        return this.renderMetaWebsite(item, index);
      case "email":
        return this.renderMetaEmail(item, index);
      case "phone":
        return this.renderMetaPhone(item, index);
      case "single_price":
        return this.renderSinglePrice(item, index);
      default:
        return false;
    }
  };

  renderBoxBorder = (text, hour) => {
    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: Consts.colorGray1,
          paddingVertical: 5,
          paddingHorizontal: 8,
          borderRadius: Consts.round,
          marginTop: 10,
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: "500",
            color: Consts.colorDark2,
          }}
        >
          {text}
        </Text>
        <View style={{ height: 4 }} />
        <Text style={{ fontSize: 11, color: Consts.colorDark3 }}>{hour}</Text>
      </View>
    );
  };

  renderDescription = (item) => {
    const { settings } = this.props;
    return (
      <ContentBox
        key={item.type}
        headerTitle={item.text}
        headerIcon="file-text"
        style={{ marginBottom: 10 }}
        colorPrimary={settings.colorPrimary}
      >
        <HtmlViewer html={item.value} />
      </ContentBox>
      // <View
      //   key={item.type}
      //   style={{
      //     paddingVertical: 13,
      //     marginTop: 10,
      //     borderTopWidth: 1,
      //     borderTopColor: Consts.colorGray1
      //   }}
      // >
      //   <Text style={stylesBase.text}>{item.content}</Text>
      // </View>
    );
  };

  renderTags = (item) => {
    return (
      <View key={item.type}>
        {item.value.length > 0 &&
          item.value.map((tag) => (
            <View key={tag.slug} style={{ marginRight: 15, marginBottom: 10 }}>
              <IconTextMedium iconName="check" iconSize={30} text={tag.name} />
            </View>
          ))}
      </View>
    );
  };

  renderVideo = (item) => {
    const { settings } = this.props;
    return (
      <ContentBox
        key={item.type}
        headerTitle={item.type}
        headerIcon={item.icon}
        style={{ marginBottom: 10 }}
        colorPrimary={settings.colorPrimary}
      >
        <Row gap={10}>
          {item.value.map((item, index) => (
            <Col key={index.toString()} column={2} gap={10}>
              <Video source={item.src} thumbnail={item.thumbnail} />
            </Col>
          ))}
        </Row>
      </ContentBox>
    );
  };

  renderTextArea = (item) => {
    const { settings } = this.props;
    return (
      <ContentBox
        key={item.type}
        headerTitle={item.text}
        headerIcon={item.icon}
        style={{ marginBottom: 10 }}
        colorPrimary={settings.colorPrimary}
      >
        <HtmlViewer
          htmlWrapCssString={`font-size: 13px; color: ${
            Consts.colorDark2
          }; line-height: 1.4em; ${RTL() && `texAlign: left`}`}
          html={item.value}
          containerMaxWidth={Consts.screenWidth - 22}
          containerStyle={{ paddingRight: 0 }}
        />
      </ContentBox>
    );
  };

  renderBoxIcon = (item) => {
    const { settings } = this.props;

    return (
      <ContentBox
        key={item.type}
        headerTitle={item.text}
        headerIcon={item.icon}
        style={{ marginBottom: 10 }}
        colorPrimary={settings.colorPrimary}
      >
        {item.value.length > 0 &&
          item.value.map((boxIcon) => (
            <View
              key={boxIcon.key}
              style={{ marginRight: 15, marginBottom: 10 }}
            >
              <IconTextMedium
                iconName={boxIcon.icon ? boxIcon.icon : "check"}
                iconSize={30}
                text={boxIcon.name}
              />
            </View>
          ))}
      </ContentBox>
    );
  };

  renderProduct = (item) => {
    const { settings, navigation } = this.props;
    return (
      <ContentBox
        key={item.type}
        headerTitle={item.text}
        headerIcon={item.icon}
        style={{ marginBottom: 10 }}
        colorPrimary={settings.colorPrimary}
      >
        <ListingProductClassic
          data={item.value}
          navigation={navigation}
          colorPrimary={settings.colorPrimary}
        />
      </ContentBox>
    );
  };

  renderSection = (item) => {
    switch (item.type) {
      case "video":
        return this.renderVideo(item);
      case "textarea":
        return this.renderTextArea(item);
      case "listing_content":
        return this.renderDescription(item);
      case "boxIcon":
        return this.renderBoxIcon(item);
      case "listing_tag":
        return this.renderTags(item);
      case "my_products":
        return this.renderProduct(item);
      default:
        return false;
    }
  };

  _renderAdmob = ({ oBanner }) => {
    return <View>{oBanner && <Admob {...oBanner} />}</View>;
  };

  render() {
    const { eventDetail, translations } = this.props;
    const { isLoading } = this.state;
    const { oAdmob } = eventDetail;
    console.log(eventDetail.bodyBlock);
    return (
      <View
        style={{
          marginHorizontal: -10,
        }}
      >
        <ViewWithLoading isLoading={isLoading} contentLoader="content">
          {!isEmpty(eventDetail) && (
            <View style={{ width: Consts.screenWidth }}>
              <View
                style={{
                  backgroundColor: "#fff",
                  marginBottom: 10,
                }}
              >
                <View style={styles.item}>
                  {eventDetail.oCalendar && (
                    <IconTextMedium
                      iconName="calendar"
                      iconSize={30}
                      text={`${eventDetail.oCalendar.oStarts.date} - ${eventDetail.oCalendar.oEnds.date}`}
                    />
                  )}
                  {eventDetail.oCalendar && (
                    <View style={{ flexDirection: "row" }}>
                      {this.renderBoxBorder(
                        translations.openingAt,
                        eventDetail.oCalendar.oStarts.hour
                      )}
                      <View style={{ width: 5 }} />
                      {this.renderBoxBorder(
                        translations.closedAt,
                        eventDetail.oCalendar.oEnds.hour
                      )}
                    </View>
                  )}
                </View>
                {eventDetail.headerBlock.length > 0 &&
                  eventDetail.headerBlock.map(this.renderMeta)}
              </View>
              {!_.isEmpty(oAdmob) && (
                <View style={{ marginBottom: 10 }}>
                  {this._renderAdmob(oAdmob)}
                </View>
              )}
              <View style={{ marginHorizontal: 10 }}>
                {eventDetail.bodyBlock.length > 0 &&
                  eventDetail.bodyBlock.map(this.renderSection)}
              </View>
            </View>
          )}
        </ViewWithLoading>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: Consts.colorGray2,
  },
});

const mapStateToProps = (state) => ({
  eventDetail: state.eventDetail,
  settings: state.settings,
  translations: state.translations,
});

export default connect(mapStateToProps, {
  getEventDetail,
  resetEventDiscussion,
})(EventDetailContainer);
