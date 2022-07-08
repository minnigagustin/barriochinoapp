function throwErrorFnExist(isFn, type) {
    if (!isFn) {
        throw new Error(`You need to initialize renderProps of the type "${type}" defined in defineRenderFields prop.\n Eg: <WilForm render${type}={({ name, label, ...}) => { return <FieldComponent /> }} ... />`).message;
    }
}
export default throwErrorFnExist;
