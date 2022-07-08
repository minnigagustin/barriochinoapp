import React, { PureComponent } from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import {
  Col,
  ViewWithLoading,
  ContentBox,
  Row,
  isEmpty,
} from "../../wiloke-elements";
import _ from "lodash";
import { getListingCoupon } from "../../actions";
import { ListingCoupon } from "../dumbs";

class ListingCouponContainer extends PureComponent {
  _getListingCoupon = () => {
    const { params, getListingCoupon, type } = this.props;
    const { id, item, max } = params;
    type === null && getListingCoupon(id, item, max);
  };

  componentDidMount() {
    this._getListingCoupon();
  }

  renderContent = (id, item, isLoading, coupon) => {
    const { settings, translations } = this.props;
    return (
      <ViewWithLoading isLoading={isLoading} contentLoader="contentHeader">
        {!_.isEmpty(coupon) && (
          <ContentBox
            headerTitle={item.name}
            headerIcon="calendar"
            style={{
              width: "100%",
            }}
            colorPrimary={settings.colorPrimary}
          >
            <ListingCoupon
              data={coupon}
              translations={translations}
              colorPrimary={settings.colorPrimary}
            />
          </ContentBox>
        )}
      </ViewWithLoading>
    );
  };

  render() {
    const { params, type, listingCoupon } = this.props;
    const { id, item } = params;

    const listingID = `${id}_details`;

    const coupon = _.get(listingCoupon, `${listingID}`, {});
    return this.renderContent(id, item, _.isEmpty(coupon), coupon);
  }
}

const mapStateToProps = (state) => ({
  translations: state.translations,
  settings: state.settings,
  listingCoupon: state.listingCoupon,
});

const mapDispatchToProps = {
  getListingCoupon,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListingCouponContainer);
