import React, { PureComponent } from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import _ from "lodash";
import { getListingCustomSection } from "../../actions";
import {
  ViewWithLoading,
  ContentBox,
  RequestTimeoutWrapped,
  HtmlViewer,
  RTL,
  IconTextMedium,
  Row,
  Col,
} from "../../wiloke-elements";
import { screenWidth } from "../../constants/styleConstants";

class ListingCustomSectionContainer extends PureComponent {
  _getListingCustom = async () => {
    const { getListingCustomSection, params, type } = this.props;
    const { id, item } = params;
    type === null && getListingCustomSection(id, item);
    const { listingCustomSection } = this.props;
  };
  componentDidMount() {
    this._getListingCustom();
  }

  renderBoxIcon = (item, customSections) => {
    const sections = customSections.filter((i) => i.unChecked === "no");
    return (
      sections.length > 0 &&
      sections.map((boxIcon) => (
        <Col key={boxIcon.key} column={2} gap={10}>
          <View style={{ marginRight: 15, marginBottom: 10 }}>
            <IconTextMedium
              iconName={boxIcon.icon ? boxIcon.icon : "check"}
              iconSize={30}
              text={boxIcon.name}
            />
          </View>
        </Col>
      ))
    );
  };

  renderHTML = (item, customSections) => {
    return (
      <HtmlViewer
        html={customSections}
        htmlWrapCssString={`font-size: 13px; line-height: 1.4em; overflow:hidden`}
        containerMaxWidth={screenWidth - 40}
        containerStyle={{ paddingLeft: 10 }}
      />
    );
  };

  renderContent = (id, item, isLoading, datas) => {
    const { settings } = this.props;
    const customSections = _.get(datas, `${item.key}`, "__empty__");
    if (customSections === "__empty__") return null;
    return (
      <ViewWithLoading isLoading={isLoading} contentLoader="contentHeader">
        <ContentBox
          headerTitle={item.name}
          headerIcon={item.icon}
          style={{
            marginBottom: 10,
            width: "100%",
          }}
          colorPrimary={settings.colorPrimary}
        >
          <Row>
            {item.style === "boxIcon"
              ? this.renderBoxIcon(item, customSections)
              : this.renderHTML(item, customSections)}
          </Row>
        </ContentBox>
      </ViewWithLoading>
    );
  };
  render() {
    const { type, params, listingCustomSection } = this.props;

    const { item } = params;
    const id = `${params.id}_details`;
    const customSections = _.get(listingCustomSection, `${id}.${item.key}`, []);

    return this.renderContent(
      id,
      item,
      _.isEmpty(customSections),
      listingCustomSection[id]
    );
  }
}

const mapStateToProps = (state) => ({
  translations: state.translations,
  settings: state.settings,
  listingDetail: state.listingDetail,
  listingCustomSection: state.listingCustomSection,
});

const mapDispatchToProps = {
  getListingCustomSection,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListingCustomSectionContainer);
