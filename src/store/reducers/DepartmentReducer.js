// DepartmentReducer.js
const initialState = {
  departments: [],
};

const departmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_DEPARTMENTS':
      return {
        ...state,
        departments: action.payload,
      };
    default:
      return state;
  }
};

export default departmentReducer;
