import { render, screen } from "@testing-library/react";
import { useDispatch } from "react-redux";
import AmountPicker from '../components/modal/amount-picker';
import userEvent from "@testing-library/user-event";
import { addToCart, deleteFromCart } from "../redux/cartSlice";


// useDispatch Mocklama Alanı:
jest.mock("react-redux", () => ({
    useDispatch: jest.fn()
}));

const cartItem = {
    name: 'Frambuaz Parçacıklı',
    image: '/frn.png',
    price: 32,
    id: '57ea',
    type: 'cup',
    amount: 1,
};

describe("AmountPicker", () => {

    const mockDispatch = jest.fn();

    beforeEach(() => {
        useDispatch.mockReturnValue(mockDispatch);
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    it("Bileşen  item.amount değeri doğr şekilde render eder", () => {
        render(<AmountPicker item={cartItem} />);
        screen.getByText(cartItem.amount);

    });

    // --------------------------------------------------------------------------------------------------------------

    it(" - butonuna tıklanınca deleteFromCartcaksiyonu çalışır", async () => {
        const user = userEvent.setup();
        render(<AmountPicker item={cartItem} />);
        const btn = screen.getByRole("button", { name: "-" });
        await user.click(btn);
        expect(mockDispatch).toHaveBeenCalledWith(deleteFromCart(cartItem));

    });

    // --------------------------------------------------------------------------------------------------------------

    it(" + butonuna tıklanınca addToCart aksiyonu çalışır", async () => {
        const user = userEvent.setup();
        render(<AmountPicker item={cartItem} />);
        const btn = screen.getByRole("button", { name: "+" });
        await user.click(btn);
        expect(mockDispatch).toHaveBeenCalledWith(addToCart({ item: cartItem, selectedType: cartItem.type }));

    });
});


