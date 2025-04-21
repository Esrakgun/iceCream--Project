import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    cart: [],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, { payload }) => {
            // alert("Ürün Sepete Eklendi..")
            // console.log(payload);
            // !Sepette Aynı Üründen Var mı?
            const found = state.cart.find((item) => item.id === payload.item.id && item.type === payload.selectedType);

            if (found) {
                // !Eğer Sepette Aynı Üründen Varsa Miktarını Arttıyoruz:
                found.amount++;
            } else {
                // !Eğer Yoksa Yeni Ürünü Sepete Ekle:
                state.cart.push({
                    ...payload.item,
                    type: payload.selectedType,
                    amount: 1,
                });
            }
        },

        deleteFromCart: (state, { payload }) => {
            // !Sepetteki Ürünü Bul:
            const index = state.cart.findIndex((item) => item.id === payload.id && item.type === payload.type);

            if (state.cart[index].amount > 1) {
                // !Eğer Miktarı 1'den Fazlaysa Miktarı Azalt:
                state.cart[index].amount--;

            } else {
                //! Eğer Miktarı 1 ise Ürünü Kaldır:
                state.cart.splice(index, 1);
            }
        },


        clearCart: (state) => {
            state.cart = [];
        },

    },
});


export const { addToCart, deleteFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;



