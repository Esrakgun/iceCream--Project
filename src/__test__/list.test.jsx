import { queryByTestId, render, screen, waitFor } from "@testing-library/react";
import api from "../utils/api";
import List from "../components/list";
import Card from "../components/card";
import { mockData } from "../utils/constants";

// Api Modülünü Mockla:
jest.mock("../utils/api");


// Card Component'ını Mockla:
// Şuan basit bir title basıyor olsak da ileride Daha Complex bir Component olduğunda list testler de etkileneceğinden dolayı değiştirmek istemiyoruz..
jest.mock("../components/card");

describe("List Bileşeni Testleri", () => {

  // Her Test ile Gelen Farklı cevaplar Olduğu İçin ;
  // Her Test Sonrası Mock Ayarlarını Resetlicez:
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Api'den Cevap Gelmediyse Ekrana  Loader Basılır", async () => {

    // Bu testte Api İsteği Atılınca bu Cevap dönsün:
    api.get.mockResolvedValueOnce({ data: [] });

    // Bileşeni Renderla:
    render(<List />);

    // Ekranda Loader Vardır:
    screen.getAllByTestId("loader");

    // Belirli Bir Sürenin Ardından Ekrandan Loader gider?
    await waitFor(() => {
      expect(screen.queryByTestId("loader")).toBeNull();

    });
    
  });

  //----------------------------------------------------------

  it("Api'dan Hata Cevabı Gelirse Ekrana Error Basılır", async () => {

    // Api.get çalışınca Error Dönsün:
    api.get.mockRejectedValue(new Error("hata oldu"));

    // Bileşeni Renderla:
    render(<List />);

    // Belirli Bir Sürenin Ardından Ekrana Hata Component Basılır:
    await waitFor(() => screen.getByTestId("error"));
  });


  //---------------------------------------------------------

  it("Api'dan Başarılı Cevap Gelirse Ekrana Card'lar Basılır", async () => {

    // Card'ların Yerine Basılacak İçeriği Belirle:
    Card.mockImplementation(({ item }) => <div>{item.name}</div>);

    // Api.get İsteği Atılınca Dondurma Verilerini Döndür:
    api.get.mockResolvedValue({ data: mockData });

    // Bileşeni Renderla:
    render(<List />);

    // Belirli Bir Sürenin Ardından Api.get'den Dönen Dizideki Her Bir Veri İçin Ekrana Bir Tane Kart Basılır:
    await waitFor(() => {
      mockData.forEach((item) => {
        screen.getByText(item.name);
      });

    });


  });

});






