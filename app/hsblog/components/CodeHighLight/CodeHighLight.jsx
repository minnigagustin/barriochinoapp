import React, { memo } from 'react';
import SyntaxHighlighter from 'react-native-syntax-highlighter';
import atomDark from './atomDark';
import styles from './styles';
function CodeHighLight({ children, language = 'jsx', containerStyle = {}, ...rest }) {
    return (<SyntaxHighlighter {...rest} style={atomDark} customStyle={{
        ...styles.container,
        ...containerStyle,
    }} language={language} fontSize={14} highlighter="prism">
      {children}
    </SyntaxHighlighter>);
}
export default memo(CodeHighLight);
