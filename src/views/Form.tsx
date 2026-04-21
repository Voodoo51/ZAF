import { useState } from "react";

type TFormData = {
    name: String,
    surname: String,
    album: String,
    pesel: String,
    faculty: String,
    formOfStudy: String,
    accountNr: String
}

export const FormView = () => {
  const [name, setName] = useState<String>("");
  const [surname, setSurname] = useState<String>("");
  const [album, setAlbum] = useState<String>("");
  const [pesel, setPesel] = useState<String>("");
  const [faculty, setFaculty] = useState<String>("wbia");
  const [formOfStudy, setFormOfStudy] = useState<String>("full-time");
  const [accountNr, setAccountNr] = useState<String>("");

  const sendForm = () => {
    const formData: TFormData = {
        name,
        surname,
        album,
        pesel,
        faculty,
        formOfStudy,
        accountNr
    }
    console.log(formData);
  }

//   Funkcja przechwytuje kliknięcia, sprawdza czy to nie
//   backspace i przechwytuje próby wpisania czegoś
//   co nie jest liczbą
  const validateIfNaN = (e: any) => {
    e.persist();
    if(e.keyCode === 8)
        return;
    if(!(e.keyCode >= 48 && e.keyCode <= 57))
        e.preventDefault();
  }

  return (
  <div className="py-5 flex items-center justify-center bg-gray-50">
    <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-md">
      <h1 className="text-2xl font-semibold text-center mb-6">
        Stypendium 2025/26
      </h1>

      <div className="flex justify-between items-center text-sm mb-5">
        <input
            placeholder="Imię"
            className="w-40 mb-3 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            autoFocus
            onChange={(e) => setName(e.target.value)}
        />
        <input
            placeholder="Nazwisko"
            className="w-40 mb-3 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            onChange={(e) => setSurname(e.target.value)}
        />
      </div>


      <div className="flex justify-between items-center text-sm mb-5">
        <input
            placeholder="Album"
            maxLength={7}
            className="w-24 mb-4 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            onKeyDown={(e) => {
                validateIfNaN(e)
            }}
            onChange={(e) => setAlbum(e.target.value)}
        />
        <input
            placeholder="PESEL"
            maxLength={11}
            className="w-32 mb-4 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            onKeyDown={(e) => {
                validateIfNaN(e)
            }}
            onChange={(e) => setPesel(e.target.value)}
        />
      </div>

      <select
        className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        onChange={(e) => setFaculty(e.target.value)}
      >
        <option value="wbia">Wydział Budownictwa i Architektury</option>
        <option value="wmibm">Wydział Mechatroniki i Budowy Maszyn</option>
        <option value="wzimk">Wydział Zarządzania i Modelowania Komputerowego</option>
        <option value="weaii">Wydział Elektrotechniki, Automatyki i Informatyki</option>
      </select>

      <select
        className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        onChange={(e) => setFormOfStudy(e.target.value)}
      >
        <option value="full-time">stacjonarne</option>
        <option value="part-time">niestacjonarne</option>
      </select>

      <input
            placeholder="Nr konta bankowego"
            maxLength={26}
            className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            onKeyDown={(e) => {
                validateIfNaN(e)
            }}
            onChange={(e) => setAccountNr(e.target.value)}
      />
      
      <div className="flex justify-between items-center text-sm mb-5">
        <button
            className="w-fit px-2 py-3 mb-4 rounded-lg text-white bg-[rgb(63,152,255)] hover:opacity-90 transition"
            onClick={sendForm}
        >
            Prześlij formularz
        </button>
        <button
            className="w-fit px-2 py-3 mb-4 rounded-lg text-white bg-[rgb(199,199,199)] hover:opacity-90 transition"
        >
            Zobacz podgląd
        </button>
      </div>
    </div>
  </div>
  );
};