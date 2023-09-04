import { selector } from "recoil";
import { userDetails } from "../atoms/atoms";

export const UPDATE_USER_DETAILS = selector({
  key: "UPDATE_USER_DETAILS", // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const name = get(userDetails);
    const lengthOfName = name.length;
    return lengthOfName;
  },
});
