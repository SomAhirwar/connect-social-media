function inputSetState(setState) {
  return function (event) {
    setState(event.target.value);
  };
}

export default inputSetState;
