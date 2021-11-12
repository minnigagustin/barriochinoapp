export default function getDisplayNameHOC(WrappedComponent) {
    return (WrappedComponent.displayName ?? WrappedComponent.name) || 'Component';
}
