import { render, screen, getByRole } from "@testing-library/react";
import CartItem from "../components/modal/cart-item";
import AmountPicker from "../components/modal/amount-picker";



// Mock Alanı:AmountPicker Moclanıcak:
jest.mock("../components/modal/amount-picker", () => () => <h1>Picker</h1>);


const cupItem = {
    name: 'Frambuaz Parçacıklı',
    image: '/frn.png',
    price: 32,
    id: '57ea',
    type: 'cup',
    amount: 1,
}

const cornetItem = {
    name: 'Fındıklı Krem',
    image: '/fındıklı.png',
    price: 26, id: 'a87e',
    type: 'cornet',
    amount: 1,
}


it("İtem type 'cup' olduğunda doğru render ediliyor mu?", () => {

    // Bileşeni Renderla:
    render(<CartItem item={cupItem} />)

    // Resmin Doğru Kontrol Edildiğini Kontrol Et:
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", cupItem.image);

    // Type yazısı Doğru mu Kontrol Et:
    screen.getByText("Bardakta");

    // Toplam Fiyatı Doğru mu Kontrol Et: 
    screen.getByText(`${cupItem.price * cupItem.amount}₺`);


});

// --------------------------------------------------------------------------------------------------------------

it("İtem type 'cornet' olduğunda doğru render ediliyor mu?", () => {

    // Bileşeni Renderla:
    render(<CartItem item={cornetItem} />);

    // Resmin Doğru Kontrol Edildiğini Kontrol Et:
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", cornetItem.image);

    // Type yazısı Doğru mu Kontrol Et:
    screen.getByText("Külahta");

    // Toplam Fiyatı Doğru mu Kontrol Et: 
    screen.getByText(`${cornetItem.price * cornetItem.amount}₺`);



});


