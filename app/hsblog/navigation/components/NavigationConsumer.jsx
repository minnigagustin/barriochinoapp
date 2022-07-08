import { PureComponent } from 'react';
import { withNavigation } from 'react-navigation';
class NavigationConsumer extends PureComponent {
    render() {
        const { children, navigation } = this.props;
        return children(navigation);
    }
}
export default withNavigation(NavigationConsumer);
