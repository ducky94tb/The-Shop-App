import Product from "../../models/product";
import {
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
  SET_PRODUCTS,
} from "../actions/products";

const initialState = {
  availableProducts: [],
  userProducts: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return {
        availableProducts: action.products,
        userProducts: action.userProducts,
      };
    case DELETE_PRODUCT:
      return {
        ...state,
        userProducts: state.userProducts.filter(
          (product) => product.id !== action.pid
        ),
        availableProducts: state.availableProducts.filter(
          (product) => product.id !== action.pid
        ),
      };
    case CREATE_PRODUCT:
      const newProduct = new Product(
        action.productData.id,
        "u1",
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        action.productData.price
      );
      return {
        ...state,
        availableProducts: state.availableProducts.concat(newProduct),
        userProducts: state.userProducts.concat(newProduct),
      };
    case UPDATE_PRODUCT:
      console.log(action.productData);
      const productIndex = state.userProducts.findIndex(
        (product) => product.id === action.pid
      );
      const updatedProduct = new Product(
        action.pid,
        state.userProducts[productIndex].ownerId,
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        state.userProducts[productIndex].price
      );
      const updatedUserProducts = [...state.userProducts];
      updatedUserProducts[productIndex] = updatedProduct;
      const pId = state.availableProducts.findIndex(
        (prod) => prod.id === action.pid
      );
      const updatedAvailableProducts = [...state.availableProducts];
      updatedUserProducts[pId] = updatedProduct;
      return {
        userProducts: updatedUserProducts,
        availableProducts: updatedAvailableProducts,
      };
    default:
      return state;
  }
};
