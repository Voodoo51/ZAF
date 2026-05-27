import { use, useState } from "react"

export const CreatorView = () => {
    class InputObject {
        id: number = 0;
        label: string = "";
        placeholder: string = "";
        type: string = "none";
    }

    const [arr, setArr] = useState([new InputObject]);
    const [formTitle, setFormTitle] = useState<string>("");

    const addInput = () => {
        setArr(arr => {
            const maxId = arr.length
            ? Math.max(...arr.map(item => item.id))
            : 0;

            const newInput = new InputObject();
            newInput.id = maxId + 1;

            return [
                ...arr,
                newInput
            ];
        });
        console.log(arr);
    };

    const changeValue = (e: React.ChangeEvent<any>, id: number) => {
        e.preventDefault();

        setArr(arr => arr.map(value => {
            if(id === value.id)
                return {...value, label: e.target.value};
            return value;
        }))
        console.log(arr);
    };
    
    const changePlaceholder = (e: React.ChangeEvent<any>, id: number) => {
        e.preventDefault();

        setArr(arr => arr.map(placeholder => {
            if(id === placeholder.id)
                return {...placeholder, placeholder: e.target.value};
            return placeholder;
        }));
        console.log(arr);
    };

    const changeType = (e: React.ChangeEvent<any>, id: number) => {
        e.preventDefault();

        setArr(arr => arr.map(type => {
            if(id === type.id)
                return {...type, type: e.target.value};
            return type;
        }));
        console.log(arr);
    };
    
    const delInput = (id: number) => {
        setArr(arr => arr.filter((item, index) => id !== item.id));
        console.log(arr);
    };

    const handleSave = async () => {
        try {
            const payload = {
                title: formTitle,
                formFields: arr.map(({ id, label, placeholder, type }) => ({id, label, placeholder, type}))
            };

            const response = await fetch("http://localhost:8080/form/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            window.location.href = "/";
        } else {
            console.error("Failed to save form");
        }
    } catch (error) {
        console.error("Error while saving form:", error);
    }
};
    return (
    <div className="min-h-screen py-10 flex items-start justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-6xl">
            <h1 className="text-3xl font-semibold text-center mb-8">
                Nazwa formularza
            </h1>

            <div className="flex justify-center mb-10">
                <input
                    placeholder="Podaj nazwę formularza"
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-300"
                    autoFocus
                />
            </div>

            {/* Headers */}
            <div className="grid grid-cols-4 gap-4 mb-3 px-1">
                <h3 className="font-semibold text-sm">
                    Nazwa pola
                </h3>

                <h3 className="font-semibold text-sm">
                    Podpowiedź
                </h3>

                <h3 className="font-semibold text-sm">
                    Ograniczenie
                </h3>

                <h3 className="font-semibold text-sm text-center">
                    Usuń
                </h3>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
                {arr.map((item: InputObject) => {
                    return (
                        <div
                            key={item.id}
                            className="grid grid-cols-4 gap-4 items-center"
                        >
                            <input
                                onChange={(e) => changeValue(e, item.id)}
                                value={item.label}
                                type="text"
                                placeholder="Nazwa pola"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />

                            <input
                                onChange={(e) => changePlaceholder(e, item.id)}
                                value={item.placeholder}
                                type="text"
                                placeholder="Podpowiedź"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />

                            <select
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                onChange={(e) => changeType(e, item.id)}
                                value={item.type}
                            >
                                <option value="none">Brak</option>
                                <option value="phoneNumber">Nr telefonu</option>
                                <option value="album">Nr albumu</option>
                                <option value="pesel">PESEL</option>
                                <option value="email">Email</option>
                            </select>

                            <div className="flex justify-center">
                                <button
                                    onClick={() => delInput(item.id)}
                                    className="px-4 py-3 rounded-lg text-white bg-[rgb(63,152,255)] hover:opacity-90 transition"
                                >
                                    -
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Bottom buttons */}
            <div className="flex items-center justify-between mt-8">
                <button
                    onClick={addInput}
                    className="px-5 py-3 rounded-lg text-white bg-[rgb(63,152,255)] hover:opacity-90 transition"
                >
                    +
                </button>

                <button
                    onClick={handleSave}
                    className="px-5 py-3 rounded-lg text-white bg-[rgb(63,152,255)] hover:opacity-90 transition"
                >
                    Stwórz formularz
                </button>
            </div>
        </div>
    </div>
);
}