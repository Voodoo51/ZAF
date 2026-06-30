import { FormField } from "../types";


interface Props {

    fields: FormField[];

    selectedId:number|null;

    setSelectedId:
        React.Dispatch<
            React.SetStateAction<number|null>
        >;

    setFields:
        React.Dispatch<
            React.SetStateAction<FormField[]>
        >;
    
    pageCount: number
}



export const FieldSidebar = ({
    fields,
    selectedId,
    setSelectedId,
    setFields,
    pageCount
} : Props)=>{


const selected =
    fields.find(
        f => f.id === selectedId
    );



const updateField = (
    key: keyof FormField,
    value: any
) => {

    if (selectedId === null) {
        return;
    }

    setFields(old =>
        old.map(f =>
            f.id === selectedId
                ? {
                    ...f,
                    [key]: value
                }
                : f
        )
    );
};



return (

<div className="
w-72
bg-white
border-r
p-4
h-screen
overflow-auto
">


<h2 className="
font-bold
text-xl
mb-4
">
Fields
</h2>



{
fields.map(field=>(


<button

key={field.id}

onClick={() =>
    setSelectedId(field.id)
}

className={`
w-full
text-left
p-3
rounded
mb-2

${
selectedId===field.id
?
"bg-blue-200"
:
"bg-gray-100"
}
`}

>

{field.label || 
`Field ${field.id}`}

</button>


))
}



{
selected && (

<div className="
mt-6
border-t
pt-4
space-y-4
">


<h3 className="font-bold">
Selected field
</h3>


<div>

<label>
Font size
</label>


<input

type="number"

className="
border
rounded
w-full
p-2
"

value={
selected.fontSize ?? 20
}


onChange={(e)=>
    updateField(
        "fontSize",
        Number(e.target.value)
    )
}

/>

</div>



<div>

<label>
X position
</label>


<input

type="number"

className="
border
rounded
w-full
p-2
"

value={
selected.x ?? 0
}


onChange={(e)=>
    updateField(
        "x",
        Number(e.target.value)
    )
}

/>

</div>




<div>

<label>
Y position
</label>


<input

type="number"

className="
border
rounded
w-full
p-2
"

value={
selected.y ?? 0
}


onChange={(e)=>
    updateField(
        "y",
        Number(e.target.value)
    )
}

/>

</div>




<div>

<label>
Page
</label>

<select
className="
border
rounded
w-full
p-2
"

value={selected.page ?? 1}
onChange={(e)=>
    updateField(
        "page",
        Number(e.target.value)
    )
}

>

{
Array.from(
    {length:pageCount},
    (_,i)=>i+1
)
.map(page=>(

<option
key={page}
value={page}
>

Page {page}

</option>

))
}

</select>

</div>


</div>

)

}

</div>

);

}