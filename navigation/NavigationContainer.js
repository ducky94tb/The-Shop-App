import React, { useEffect, useRef } from "react";
import { NavigationActions } from "react-navigation";
import { useSelector } from "react-redux";
import ShopNavigator from "./ShopNavigator";

const NavigationContainer = (props) => {
  const isAuth = useSelector((state) => !!state.auth.token);
  console.log(useSelector((state) => state));
  const navRef = useRef();
  useEffect(() => {
    if (!isAuth) {
      navRef.current.dispatch(
        NavigationActions.navigate({ routeName: "Auth" })
      );
    } else {
      navRef.current.dispatch(
        NavigationActions.navigate({ routeName: "Shop" })
      );
    }
  }, [isAuth]);
  return <ShopNavigator ref={navRef} />;
};
export default NavigationContainer;
