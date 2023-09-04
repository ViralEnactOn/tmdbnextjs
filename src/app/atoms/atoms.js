import { atom } from "recoil";

export const userDetails = atom({
  key: "userDetails",
  default: "",
});

export const sortType = atom({
  key: "sortType",
  default: { name: "Popularity Descending", value: "popularity.desc" },
});

export const countryName = atom({
  key: "countryName",
  default: { name: "India", value: "IN" },
});

export const watchProviders = atom({
  key: "WatchProviders",
  default: "",
});

export const releaseDateGte = atom({
  key: "releaseDateGte",
  default: "",
});

export const releaseDateLte = atom({
  key: "releaseDateLte",
  default: "",
});

export const genresList = atom({
  key: "genresList",
  default: "",
});

export const certificationList = atom({
  key: "certificationList",
  default: "",
});

export const voteAverageGte = atom({
  key: "voteAverageGte",
  default: "",
});

export const voteAverageLte = atom({
  key: "voteAverageLte",
  default: "",
});

export const voteCountGte = atom({
  key: "voteCountGte",
  default: "",
});

export const runtimeGte = atom({
  key: "runtimeGte",
  default: "",
});

export const runtimeLte = atom({
  key: "runtimeLte",
  default: "",
});
