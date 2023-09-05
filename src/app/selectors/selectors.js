import { selector, useRecoilState } from "recoil";
import {
  certificationList,
  countryName,
  genresList,
  releaseDateGte,
  releaseDateLte,
  runtimeGte,
  runtimeLte,
  sortType,
  userDetails,
  voteAverageGte,
  voteAverageLte,
  voteCountGte,
  watchProviders,
} from "../atoms/atoms";

export const allDataSelector = selector({
  key: "allDataSelector",
  get: ({ get }) => {
    return {
      userDetails: get(userDetails),
      sortType: get(sortType),
      countryName: get(countryName),
      watchProviders: get(watchProviders),
      releaseDateGte: get(releaseDateGte),
      releaseDateLte: get(releaseDateLte),
      genresList: get(genresList),
      certificationList: get(certificationList),
      voteAverageGte: get(voteAverageGte),
      voteAverageLte: get(voteAverageLte),
      voteCountGte: get(voteCountGte),
      runtimeGte: get(runtimeGte),
      runtimeLte: get(runtimeLte),
    };
  },
});

export const updateAllDataSelector = selector({
  key: "updateAllDataSelector",
  get: ({ get }) => ({
    sortType: get(sortType),
    countryName: get(countryName),
    watchProviders: get(watchProviders),
    releaseDateGte: get(releaseDateGte),
    releaseDateLte: get(releaseDateLte),
    genresList: get(genresList),
    certificationList: get(certificationList),
    voteAverageGte: get(voteAverageGte),
    voteAverageLte: get(voteAverageLte),
    voteCountGte: get(voteCountGte),
    runtimeGte: get(runtimeGte),
    runtimeLte: get(runtimeLte),
  }),
  set: ({ set }, newValue) => {
    set(sortType, newValue.sortType);
    set(countryName, newValue.countryName);
    set(watchProviders, newValue.watchProviders);
    set(releaseDateGte, newValue.releaseDateGte);
    set(releaseDateLte, newValue.releaseDateLte);
    set(genresList, newValue.genresList);
    set(certificationList, newValue.certificationList);
    set(voteAverageGte, newValue.voteAverageGte);
    set(voteAverageLte, newValue.voteAverageLte);
    set(voteCountGte, newValue.voteCountGte);
    set(runtimeGte, newValue.runtimeGte);
    set(runtimeLte, newValue.runtimeLte);
  },
});
