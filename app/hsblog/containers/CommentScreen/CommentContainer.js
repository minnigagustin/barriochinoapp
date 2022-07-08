import { connect } from 'react-redux';
import { getPostComment } from "./actions/actionComments";
import CommentsScreen from "./CommentsScreen";
function mapStateToProps(state) {
    return {
        comments: state.postComments,
    };
}
const mapDispatchToProps = {
    getComments: getPostComment.request,
};
const CommentsScreenContainer = connect(mapStateToProps, mapDispatchToProps)(CommentsScreen);
export default CommentsScreenContainer;
