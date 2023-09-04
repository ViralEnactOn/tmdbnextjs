module.exports = {
  app: {
    base_url: "http://localhost:3000", // process.env.LOCAL_URL,
  },
  tmdb_services: {
    Header: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjYTRjM2I5YTY1NzE1Zjk5MDIxNGZjY2MyNjc1ZjFiYSIsInN1YiI6IjY0YWUyY2EzNmEzNDQ4MDEyY2U3MjllMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.A_-waPMhwZ0EwSkzIy99k6RbLThh9iyhTrLUmp_McHg",
    },
    IMAGE_URL: "https://www.themoviedb.org/t/p/original/",
    MOBILE_IMAGE_URL: "https://image.tmdb.org/t/p/w260_and_h390_bestv2/",
    API_URL: "https://api.themoviedb.org/3/",
  },
};
