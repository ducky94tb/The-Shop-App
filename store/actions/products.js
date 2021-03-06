import Product from "../../models/product";

export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";

export const fetchProducts = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        "https://fir-demo-e7bb2-default-rtdb.firebaseio.com/products.json"
      );
      if (!response.ok) {
        const resData = await response.resData;
        console.log(resData);
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();
      const loadedProducts = [];

      for (const key in resData) {
        loadedProducts.push(
          new Product(
            key,
            "u1",
            resData[key].title,
            resData[key].imageUrl,
            resData[key].description,
            resData[key].price
          )
        );
      }

      dispatch({
        type: SET_PRODUCTS,
        products: loadedProducts,
        userProducts: loadedProducts.filter((prod) => prod.ownerId === "u1"),
      });
    } catch (err) {
      throw err;
    }
  };
};

export const createProduct = (title, description, imageUrl, price) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://fir-demo-e7bb2-default-rtdb.firebaseio.com/products.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          price,
        }),
      }
    );

    const resData = await response.json();
    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: resData.name,
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
      },
    });
  };
};

export const updateProduct = (id, title, description, imageUrl) => {
  return async (dispatch, getState) => {
    console.log(getState());
    const response = await fetch(
      `https://fir-demo-e7bb2-default-rtdb.firebaseio.com/products/${id}.json`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }
    dispatch({
      type: UPDATE_PRODUCT,
      pid: id,
      productData: {
        title: title,
        description: description,
        imageUrl: imageUrl,
      },
    });
  };
};

export const deleteProduct = (productId) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `https://fir-demo-e7bb2-default-rtdb.firebaseio.com/products/${productId}.json`,
        {
          method: "DELETE",
        }
      );
      const resData = await response.json();
      console.log(resData);
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      dispatch({ type: DELETE_PRODUCT, pid: productId });
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  };
};
