import he from "he";
import _ from "lodash";
import * as Linking from 'expo-linking';

function deeplinkNavigate(navigation, queryParams) {
  switch(queryParams.screen) {
    case 'event-detail':
      return navigation.navigate("EventDetailScreen", {
        ...queryParams,
        name: he.decode(queryParams.postTitle),
        address: he.decode(queryParams.address),
      });
    case 'product-detail':
      return navigation.navigate("ProductDetailScreen", {
        ...queryParams,
        oFeaturedImg: queryParams.featuredImg
      });
    case 'listing-detail':
      return navigation.navigate("ListingDetailScreen", {
        ...queryParams,
        name: he.decode(queryParams.postTitle),
        tagline: !!queryParams.tagLine ? he.decode(queryParams.tagLine) : null,
        logo: queryParams.logo || queryParams.image
      });
    case 'listing-categories':
      return navigation.navigate("ListingCategories", {
        ...queryParams,
        name: he.decode(queryParams.name)
      });
    case 'listing-type':
      const screen = queryParams.postType === "event" ? "EventScreenStack" : "ListingScreenStack";
      return navigation.navigate(screen, {
        key: queryParams.postType,
        isLoading: _.isEmpty(listings[postType])
      });
    default:
      return;
  }
}

export default async function deeplinkListener(navigation, listings) {
  try {
    let url = await Linking.getInitialURL();
    const { queryParams } = Linking.parse(url);
    if (!!url) {
      deeplinkNavigate(navigation, queryParams);
      url = '';
    }
    Linking.addEventListener('url', event => {
      const { path, queryParams } = Linking.parse(event.url);
      deeplinkNavigate(navigation, queryParams);
    });
  } catch {
    console.log('deeplinkListener error');
  }
}
