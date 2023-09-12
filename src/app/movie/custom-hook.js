import React, { useState } from "react";

const useCustomHook = () => {
  const [test, setTest] = useState("hello");

  const getRandom = () => {
    return Math.random();
  };

  const getRandom2 = () => {
    setTest(Math.random());
    return Math.random();
  };
  return {
    getRandom,
    getRandom2,
    test,
  };
};

export default useCustomHook;
