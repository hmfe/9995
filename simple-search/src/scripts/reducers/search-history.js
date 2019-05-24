import { ADD_ITEM, REMOVE_ITEM } from "../actions/search-history";

const initialState = {
    items: []
};

const SearchStoryReducer = (state, action) => {
    switch (action.type) {
        case ADD_ITEM:
            return {
                ...state,
                items: [...state.items, action.payload]
            };
        default:
            return initialState;
    }
};

export default SearchStoryReducer;