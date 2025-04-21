import { render, screen } from "@testing-library/react";
import Card from "../components/card";
import { mockData } from "../utils/constants"
import { useDispatch } from "react-redux";
import userEvent from "@testing-library/user-event"
import { addToCart } from "../redux/cartSlice";

//!Redux'dan bagımsızlastırmak adına mockladık Dispatch 'i:useDispatch Mocklandı.
jest.mock("react-redux", () => ({
    useDispatch: jest.fn(),
}));

//!Sonrasında useDispatch her çağrıldığında sahte dispatch de dönmeli:
describe("Card Testleri", () => {
    //   useDispatch'in döndürdüğü Dispatch de mocklandı:
    const dispatchMock = jest.fn();

    // useDispatch her Çağrıldığında sahte dispatch methodunu return etsin:
    beforeEach(() => {
        useDispatch.mockReturnValue(dispatchMock);
    });

    // Her Testin sonunda mock'u resetle temzile:
    afterEach(() => {
        jest.clearAllMocks();
    })

    it("İtem Propuna Göre Veriler Ekrana Basılıyor mu ?", () => {
        // Bileşeni Renderla:
        render(<Card item={mockData[0]} />);

        // Başlık ve Fiyat ekrana Geliyor mu?
        screen.getByText(mockData[0].name);
        screen.getByText(`₺${mockData[0].price} / top`);

        // Resmin Kaynağı Doğru mu?
        const img = screen.getByAltText(mockData[0].name);
        expect(img).toHaveAttribute("src", mockData[0].image)

    });

    //_______________________________________________________________________________________________________________

    it("Tipin Seçili Olma Durumuna Göre Buton Görünürlüğü Değişir", async () => {

        // ? USEREVENT KURULUMU:
        const user = userEvent.setup();

        // Bileşeni Renderla:
        render(<Card item={mockData[0]} />);
        // screen.debug(); // Buradan çıktı al ve bana gönder istersen

        // Sepete Ekle Butonu Ekrandan Al:
        const basketBtn = screen.getByRole("button", { name: /sepete ekle/i });

        // Sepete Ekle Butonu Görünmezdir:
        expect(basketBtn).toHaveClass("invisible");

        // Külahta Butonunu Al: 
        const cornetBtn = screen.getByRole("button", { name: /Külahta/i });

        // Külahta Butonu Tıkla:
        await user.click(cornetBtn);

        // Sepete Ekle Butonu Görünürdür:
        expect(basketBtn).not.toHaveClass("invisible");

        // Külahta Butonu Tıkla:
        await user.click(cornetBtn);

        // Sepete Ekle Butonu Görünmezdir:
        expect(basketBtn).toHaveClass("invisible");
    });

    //_______________________________________________________________________________________________________________

    it("Sepete Ekle Butonu Tıklanınca Aksiyon Dispatch Edilir", async () => {

        // ? USEREVENT KURULUMU:
        const user = userEvent.setup();

        // Bileşeni Renderla:
        render(<Card item={mockData[0]} />);

        // Külahta Butonunu Al ve Tıkla: 
        const cornetBtn = screen.getByRole("button", { name: /külahta/i });
        await user.click(cornetBtn);

        // Sepete Butonunu Al ve Tıkla: 
        const basketBtn = screen.getByRole("button", { name: /sepete/i });
        await user.click(basketBtn);

        // dispatch'in çağrılmış olduğunu doğrula:
        expect(dispatchMock).toHaveBeenCalledTimes(1);

        // Doğru Aksiyon ve Payload ile Çağrıldığını Doğrula:
        expect(dispatchMock).toHaveBeenCalledWith(
            addToCart({
              item: mockData[0],
              selectedType: "cornet",
            })
        );
            });
        
        });







