const initialState = {
  uoms: [],
};

const vendorReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_UOM":
      return {
        ...state,
        uoms: action.payload,
      };
    default:
      return state;
  }
};

export default vendorReducer;
