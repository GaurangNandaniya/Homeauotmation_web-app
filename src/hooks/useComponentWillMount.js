import { useRef, useEffect } from "react";

const useComponentWillMount = (cb) => {
  const isCompMountedRef = useRef(false);

  if (!isCompMountedRef.current) {
    console.log("cb");
    cb();
  }

  useEffect(() => {
    isCompMountedRef.current = true;
  }, []);
};

export default useComponentWillMount;
