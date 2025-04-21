//! Not: Modal Componentinde useSelector(store'un ne döndürdüğünü söylemem lazım) ya da dispatch edilen herhangı bırsey varsa prop alan seylerı mocklıcaz:CartInfo kendi içinde dispatch ettiği için ve aynı şekilde Cartİtem da kendı içinde ..yazılan proplar Modalın kendısını etkıleyeceğınden  bizde sahtesini oluşturucaz kolaylık olması için:
import { render, screen } from '@testing-library/react';
import { useSelector } from 'react-redux';
import userEvent from '@testing-library/user-event';
import Modal from "../components/modal";
import CartInfo from '../components/modal/cart-info';
import CartItem from '../components/modal/cart-item';
import { mockCartData } from '../utils/constants';


// useSelector Mock Alanı:
jest.mock("react-redux", () => ({
    useSelector: jest.fn(),
}));

// Mock Alanı:
jest.mock("./../components/modal/cart-item", () => ({ item }) => <h1>{item.name}</h1>);
jest.mock("./../components/modal/cart-info", () => () => <h1>CartInfo</h1>);

describe("Modal Component", () => {

    const closeMock = jest.fn();

    // CartInfo ve Cartİtem Componentleri Componentleri Mpdal içerisinde kullanışdığı için useDispatch/usenavigate içerebileceği için moclayacagız bunları provıder ıle sarmalamamız lazımdı..Browser Router ıle sarmalamız gerekiyordu..Mockladıgımız elemanları aldıgı propları kullanabılıyoruz bu arada.


    it("isOpen propuna göre modal ekrana basılır", () => {

        // useSelector Çağrılınca bunu Return Etsin:
        useSelector.mockReturnValue({ cart: [] });

        //? Boş fonksiyon ()=>{} yerine yukarıda descrıbe altında closeMock fonksıyonu oluşturdum ki ben bu degişimleri rahat takip edebileyim:ReRender edebılmek ıcın aşağıdakı teknıgı kullandık bu bıze rerender ,container vb seylerı fındby .. gıbı seylerı kullanaıp screen yazmamak ıcın de kolaylık saglar yanı obje dagıtma gıbı {içinde} yazıp asagıda screen kullanmıyoruz!
        // Bileşeni Renderla:Sebebi isOpen'ın FALSE gönderilmesi başlangıçta Modal kapalı iken gözükmüyor mu bakıcam!
        const { rerender, queryByTestId, getByTestId } = render(<Modal isOpen={false} close={closeMock} />);

        // Modal Ekran da Yok Sorgusu yapıcam:
        expect(screen.queryByTestId("modal")).toBeNull();

        // Bileşeni Renderla:Bu defa isOpen TRUE olmalı:bir testete bılesenı ıkıncı kez render ettık bu sebeple rerender kullandık yukarıda olusturduk :
        rerender(<Modal isOpen={true} close={closeMock} />);

        // Modal Ekran da Vardır:rerender kurduk artık screen yazmamıza gerek kalmadı örnek olsun dıye burada kullanıyorum:Normalde yukarıda bu şekilde kullandım (Modal Ekran da Yok Sorgusu yapıcam : expect(screen.queryByTestId("modal")).toBeNull();)
        getByTestId("modal");

    });

    // --------------------------------------------------------------------------------------------------------------
    it("x butonuna tıklanınca close fonskiyonu çalışır", async () => {

        // Todo: USEREVENT kurulumu yapıcaz:
        const user = userEvent.setup();

        // useSelector Çağrılınca bunu Return Etsin:
        useSelector.mockReturnValue({ cart: [] });

        // Bileşeni Renderla:
        render(<Modal isOpen={true} close={closeMock} />);

        // X Butonunu Seç:
        const closeBtn = screen.getByTestId("close");

        // X Butonuna  Tıkla:
        await user.click(closeBtn);

        // Close Fonksiyonu Çalıştı mı?
        expect(closeMock).toHaveBeenCalled();

    });

    // --------------------------------------------------------------------------------------------------------------
    it("Sepet Doluluk durumuna göre ekrana uyarı basılır ", () => {

        // useSelector Çağrılınca BoŞ Diziyi Return Etsin:
        useSelector.mockReturnValue({ cart: [] });

        // Bileşeni Renderla:
        const { rerender } = render(<Modal isOpen={true} close={closeMock} />);

        // Ekranda Uyarı Mesajı Vardır:
        screen.getByText(/henüz/i);

        // Sıradaki renderlama İşleminde  useSelector Çağrılınca DoLu Diziyi Return Etsin:
        useSelector.mockReturnValue({ cart: mockCartData });

        // Bileşeni bir kez daha Renderla:
        rerender(<Modal isOpen={true} close={closeMock} />);

        // Ekranda Uyarı Mesajı Yoktur:
        expect(screen.queryByText(/henüz/i)).toBeNull();

    });

    // --------------------------------------------------------------------------------------------------------------

    it("Sepet Dolu ise her bir eleman için bir kart basılır", () => {

        // useSelector Çağrılınca bunu Return Etsin:
        // const arr = [{ name: "Çikolata" }, { name: "Vanilya" }];
        // useSelector.mockReturnValue({ cart: arr });
        useSelector.mockReturnValue({ cart: mockCartData });

        // Bileşeni Renderla:
        render(<Modal isOpen={true} close={closeMock} />);

        // Sepetteki Her Bir Veri İçin Ekrana Kart Var mı?
        mockCartData.forEach((item) => screen.getByText(item.name));
    });
});
























