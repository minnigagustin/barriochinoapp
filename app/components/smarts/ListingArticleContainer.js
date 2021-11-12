import React, { PureComponent } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import {
  getListingAritcle,
  changeListingDetailNavigation,
  getScrollTo,
} from "../../actions";
import { PostCard, ButtonFooterContentBox } from "../dumbs";
import { Col, ViewWithLoading, ContentBox, Row } from "../../wiloke-elements";
import he from "he";
import _ from "lodash";

class ListingArticleContainer extends PureComponent {
  _getListingArticle = async () => {
    const { params, getListingAritcle, type } = this.props;
    const { id, item, max } = params;
    type === null && getListingAritcle(id, item, max);
  };
  componentDidMount() {
    this._getListingArticle();
  }

  renderItem = (item, index) => {
    const { navigation } = this.props;
    return (
      <Col key={item.ID.toString()} column={2} gap={10}>
        <PostCard
          image={item.featuredImage}
          title={he.decode(item.title)}
          text={he.decode(item.excerpt)}
          style={{
            width: "100%",
          }}
          onPress={() =>
            navigation.navigate("ArticleDetailScreen", {
              id: item.ID,
              name: he.decode(item.title),
              image: item.featuredImage,
            })
          }
        />
      </Col>
    );
  };

  renderContent = (id, item, isLoading, articles, type) => {
    const { translations, settings } = this.props;
    if (articles === "__empty__") {
      return null;
    }
    return (
      <ViewWithLoading isLoading={isLoading} contentLoader="contentHeader">
        {!_.isEmpty(articles) && (
          <ContentBox
            headerTitle={item.name}
            headerIcon="calendar"
            style={{
              marginBottom: type !== "all" ? 10 : 50,
              width: "100%",
            }}
            renderFooter={
              item.status &&
              item.status === "yes" &&
              this.renderFooterContentBox(id, item)
            }
            colorPrimary={settings.colorPrimary}
          >
            <Row gap={10}>{articles.map(this.renderItem)}</Row>
          </ContentBox>
        )}
      </ViewWithLoading>
    );
  };

  renderFooterContentBox = (id, item) => {
    const {
      translations,
      changeListingDetailNavigation,
      getListingAritcle,
      getScrollTo,
    } = this.props;
    return (
      <ButtonFooterContentBox
        text={translations.viewAll.toUpperCase()}
        onPress={() => {
          changeListingDetailNavigation(item.key);
          getListingAritcle(id, item, null);
          getScrollTo(0);
        }}
      />
    );
  };

  render() {
    const {
      listingArticle,
      listingArticleAll,
      params,
      type,
      listingDetail,
    } = this.props;
    const { id, item } = params;
    const listingID = `${id}_details`;
    return type === "all"
      ? this.renderContent(
          id,
          item,
          _.isEmpty(listingArticleAll[listingID]),
          listingArticleAll[listingID],
          "all"
        )
      : this.renderContent(
          id,
          item,
          _.isEmpty(listingArticle[listingID]),
          listingArticle[listingID]
        );
  }
}

const mapStateToProps = (state) => ({
  translations: state.translations,
  settings: state.settings,
  listingDetail: state.listingDetail,
  listingArticle: state.listingArticle,
  listingArticleAll: state.listingArticleAll,
});

const mapDispatchToProps = {
  getListingAritcle,
  changeListingDetailNavigation,
  getScrollTo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListingArticleContainer);
