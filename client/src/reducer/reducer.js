export const initialState = false;
export const reducer = (state, action) => {
    if (action.type === "LOGIN") {
        return action.payload;
    }
    return state;
}
