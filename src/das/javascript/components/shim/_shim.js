function Shim($name) {
    var global = window;
    return global[$name];

}

export default Shim