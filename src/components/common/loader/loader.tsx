// import { useEffect } from 'react';
import loader from "../../../assets/loader.svg";
const Loader = () => {
  return (
    <div id="loader">
      <img src={loader} className="loader-img" alt="Loader" />
    </div>
  );
};

export default Loader;
