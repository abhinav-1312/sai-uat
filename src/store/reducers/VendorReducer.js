const initialState = {
  vendors: [],
};

const vendorReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_VENDORS':
      return {
        ...state,
        vendors: action.payload,
      };
    default:
      return state;
  }
};

export default vendorReducer;
