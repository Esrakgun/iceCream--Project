// Todo:deneme:2
// import { render, screen, fireEvent } from "@testing-library/react";
// import { Provider } from "react-redux";
// import configureStore from "redux-mock-store";
// import CartInfo from "../components/modal/cart-info";
// import { clearCart } from "../redux/cartSlice";
// import { toast } from "react-toastify";

//! 🛑 Toast'u mock'lıyoruz
// jest.mock("react-toastify", () => ({
//     toast: {
//         success: jest.fn(),
//     },
// }));

// !🛠️ Testler için mock store oluşturuyoruz
// const mockStore = configureStore([]);

// describe("CartInfo Component", () => {
//     let store;

//     beforeEach(() => {
//         store = mockStore({
//             cart: [] // Başlangıçta sepette ürün yok
//         });
//     });

//     it("sepet ürünleri ile doğru şekilde render ediyor", () => {
//         const cart = [
//             { price: 50, amount: 2 },
//             { price: 30, amount: 1 },
//         ];

//         const closeMock = jest.fn();
//         render(
//             <Provider store={store}>
//                 <CartInfo cart={cart} close={closeMock} />
//             </Provider>
//         );

//! 👀 Ara toplam, kargo ve toplam başlıklarının görüntülenip görüntülenmediğini kontrol ediyoruz
//         expect(screen.getByText("Ara Toplam")).toBeInTheDocument();
//         expect(screen.getByText("Kargo")).toBeInTheDocument();
//         expect(screen.getByText("Toplam")).toBeInTheDocument();
//     });
// ---------------------------------------------------------------------------------------------------------------
// it("ara toplam, kargo ve toplam doğru şekilde hesaplanıyor", () => {
//     const cart = [
//         { price: 60, amount: 1 },
//         { price: 70, amount: 2 },
//     ];

//! Dinamik hesaplamalar
//     const subTotal = cart.reduce((acc, item) => acc + item.price * item.amount, 0);
//     const shipping = subTotal >= 100 || subTotal === 0 ? 0 : 20;
//     const total = subTotal + shipping;

//     const closeMock = jest.fn();

//     render(
//         <Provider store={store}>
//             <CartInfo cart={cart} close={closeMock} />
//         </Provider>
//     );

//! Ara toplam, kargo ve toplam hesaplanan değerlerle eşleşiyor mu kontrol ediyoruz
//     expect(screen.getByTestId("kargo1")).toHaveTextContent(`${subTotal}₺`);
//     expect(screen.getByTestId("kargo2")).toHaveTextContent(
//         shipping === 0 ? "Ücretsiz Kargo" : `${shipping}₺`
//     );
//     expect(screen.getByTestId("kargo3")).toHaveTextContent(`${total}₺`);
// });


// ---------------------------------------------------------------------------------------------------------------
//     it("sipariş ver butonuna tıklanınca clearCart dispatch edilip toast gösteriliyor", () => {
//         const cart = [
//             { price: 40, amount: 1 },
//         ];

//         const closeMock = jest.fn();

//         render(
//             <Provider store={store}>
//                 <CartInfo cart={cart} close={closeMock} />
//             </Provider>
//         );

// ! Sipariş ver butonuna tıklıyoruz
//         fireEvent.click(screen.getByText("Sipariş Ver"));

//! close fonksiyonunun çağrıldığını ve cart'tan ürünlerin temizlendiğini kontrol ediyoruz
//         expect(closeMock).toHaveBeenCalled();
//         expect(store.getActions()).toEqual([{ type: clearCart.type }]);
//         expect(toast.success).toHaveBeenCalledWith("Ürünler Hazırlanıyor..");
//     });
// });


// todo:_______________________________________________________________________________________________________

// ----------------------------------HOCANIN YAPTIRDIĞI--------------------------------------------------------
import { render, screen, fireEvent } from "@testing-library/react";
import { useDispatch } from "react-redux";
import CartInfo from "../components/modal/cart-info";
import { clearCart } from "../redux/cartSlice";
import { toast } from "react-toastify";

// ------------------------------------------------------------------------------------------------------------

// Mock react-redux useDispatch:
jest.mock("react-redux", () => ({
    useDispatch: jest.fn(),
}));

// Mock clearCart action:
jest.mock("../redux/cartSlice", () => ({
    clearCart: jest.fn(() => ({ type: "cart/clearCart" })),
}));

// Mock toast :
jest.mock("react-toastify", () => ({
    toast: {
        success: jest.fn(),
    }
}));

// ------------------------------------------------------------------------------------------------------------

describe("CartInfo Component", () => {
    let dispatchMock;
    const closeMock = jest.fn();


    beforeEach(() => {
        dispatchMock = jest.fn();
        useDispatch.mockReturnValue(dispatchMock);
        toast.success.mockClear();
        clearCart.mockClear();
        closeMock.mockClear();
    });

    const renderWithCart = (cart) => {
        render(<CartInfo cart={cart} close={closeMock} />);
    };

    //1. ------------------------------------------------------------------------------------------------------------

    test("Display 0₺ for subtotal, shipping and total when cart is empty", () => {
        renderWithCart([]);

        //   Subtotal:
        expect(screen.getByText("Ara Toplam")).toBeInTheDocument();

        expect(screen.getAllByText("0₺")[0]).toBeInTheDocument();

        // Shipping:
        expect(screen.getByText("Kargo")).toBeInTheDocument();

        // Since Subtotal is 0 ,shipping should display '0₺'
        expect(screen.getAllByText("0₺")).toHaveLength(3);

        // Total also '0₺':
        expect(screen.getAllByText("0₺")[2]).toBeInTheDocument();

    });


    // 2.------------------------------------------------------------------------------------------------------------

    test("Calculates Shipping and total correctly when sun-btotal is below '100'", () => {
        const cart = [
            { price: 30, amount: 2 }, //60 
            { price: 10, amount: 1 }, //10 
        ];

        // Subtotal:70 ,shipping ,total:90 
        renderWithCart(cart);

        expect(screen.getByText("70₺")).toBeInTheDocument();

        expect(screen.getByText("20₺")).toBeInTheDocument();

        expect(screen.getByText("90₺")).toBeInTheDocument();

    });


    // 3.------------------------------------------------------------------------------------------------------------

    test("Displays free shipping anf toast correctly when suntotal is abover '100₺'", () => {

        const cart = [
            { price: 60, amount: 2 }, //120 
        ];

        // Subtotal :120 ,shipping :0 , total:120:

        renderWithCart(cart);

        const priceElements = screen.getAllByText("120₺");
        expect(priceElements.length).toBeGreaterThanOrEqual(2);

        expect(screen.getByText( "Ücretsiz Kargo")).toBeInTheDocument();

    });

    //4. ------------------------------------------------------------------------------------------------------------

    test("Calls Close , Dispatches clearCart and Shows toast on button click", () => {

        const cart = [{ price: 20, amount: 1 }]; //20
        renderWithCart(cart);

        const orderButton = screen.getByRole("button", { name: /Sipariş/i });

        fireEvent.click(orderButton);

        expect(closeMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(clearCart());
        expect(toast.success).toHaveBeenCalledWith("Ürünler Hazırlanıyor...");


    });

});













































