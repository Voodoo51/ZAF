import { useState } from "react"

export const CreatorView = () => {
    class InputObject {
        id: string = "1";
        value: string = "";
        placeholder: string = "Podpowiedź";
        type: string = "none";
        
        constructor() {

        }
    }

    const inputArr: Array<InputObject> = [
        new InputObject()
    ];

    const [arr, setArr] = useState(inputArr);

    const addInput = () => {
        const newId = Date.now().toString(36);
        console.log(newId);
        const newInput = new InputObject();
        newInput.id = newId;
        setArr(arr => {
            return [
                ...arr,
                newInput
            ];
        });
        console.log(arr);
    };

    const changeValue = (e: React.ChangeEvent<any>, id: string) => {
        e.preventDefault();

        setArr(arr => arr.map(value => {
            if(id === value.id)
                return {...value, value: e.target.value};
            return value;
        }))
        console.log(arr);
    };
    
    const changePlaceholder = (e: React.ChangeEvent<any>, id: string) => {
        e.preventDefault();

        setArr(arr => arr.map(placeholder => {
            if(id === placeholder.id)
                return {...placeholder, placeholder: e.target.value};
            return placeholder;
        }));
        console.log(arr);
    };

    const changeType = (e: React.ChangeEvent<any>, id: string) => {
        e.preventDefault();

        setArr(arr => arr.map(type => {
            if(id === type.id)
                return {...type, type: e.target.value};
            return type;
        }));
        console.log(arr);
    };
    
    const delInput = (id: string) => {
        setArr(arr => arr.filter((item, index) => id !== item.id));
        console.log(arr);
    };

    const createForm = () => {
        //
    };

    return (
        <div className="py-5 flex items-center justify-center bg-gray-50">
            <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w">
                <h1 className="text-2xl font-semibold text-center mb-6">
                    Nazwa formularza
                </h1>

                <div className="flex items-center justify-center mb-6">
                    <input
                        placeholder="Podaj nazwę formularza"
                        className="text-center w-60 mb-3 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                        autoFocus
                    />
                </div>

                <div className="flex justify-between items-center text-sm mb-5">
                    <h3 className="text-1xl font-semibold text-center mb-6">Podaj nazwę pola formularza</h3>
                    <h3 className="text-1xl font-semibold text-center mb-6">Podaj podpowiedź dla użytkownika</h3>
                    <h3 className="text-1xl font-semibold text-center mb-6">Wybierz ograniczenie pola formularza</h3>
                    <h3 className="text-1xl font-semibold text-center mb-6">Usuń wybrane pole formularza</h3>
                </div>

                {arr.map((item: InputObject, i) => {
                    return ([
                        <div
                            className="flex justify-between items-center text-sm mb-5"
                            key={item.id}>
                            <input
                                onChange={e => changeValue(e, item.id)}
                                value={item.value}
                                type={item.type}
                                placeholder={item.placeholder}
                                className="w-40 mb-3 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                />
                            <input
                                onChange={e => changePlaceholder(e, item.id)}
                                value={item.placeholder}
                                type={item.type}
                                placeholder={item.placeholder}
                                className="w-40 mb-3 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                />
                            <select
                                className="min-w-0.5 mb-4 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                onChange={(e) => changeType(e, item.id)}
                                value={item.type}
                                >
                                <option value="none">Brak</option>
                                <option value="phoneNumber">Nr telefonu</option>
                                <option value="album">Nr albumu</option>
                                <option value="pesel">PESEL</option>
                                <option value="faculty">Wydział</option>
                                <option value="formOfStudy">Forma studiów</option>
                            </select>
                            <button
                                onClick={() => delInput(item.id)}
                                className="w-fit px-2 py-3 mb-4 rounded-lg text-white bg-[rgb(63,152,255)] hover:opacity-90 transition px-4"
                            >-</button>
                        </div>
                        ]
                    );
                })}

                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={addInput}
                        className="w-fit px-2 py-3 mb-4 rounded-lg text-white bg-[rgb(63,152,255)] hover:opacity-90 transition px-4"
                    >+</button>
                    <button
                        onClick={createForm}
                        className="w-fit px-2 py-3 mb-4 rounded-lg text-white bg-[rgb(63,152,255)] hover:opacity-90 transition px-4"
                    >Stwórz formularz</button>
                </div>

                {arr.map((item: InputObject, i) => {
                    return (
                        <div
                        className="flex place-items-start justify-between items-center text-sm mb-5"
                        id={item.id}>
                            <h3 className="text-1xl font-semibold text-center mb-6">{item.id}</h3>
                            <h3 className="text-1xl font-semibold text-center mb-6">{item.value}</h3>
                            <h3 className="text-1xl font-semibold text-center mb-6">{item.placeholder}</h3>
                            <h3 className="text-1xl font-semibold text-center mb-6">{item.type}</h3>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}