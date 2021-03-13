import { combineReducers } from "@reduxjs/toolkit";
import { reducer as game } from "./game/slice";

export default combineReducers({
    game,
});
