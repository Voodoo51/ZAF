import {Tiles} from "../utils/Tiles";
import {useAppContext, useFilter} from "../App";
import { useEffect, useState } from "react";

type SentForm = {
  id: number,
  templateId: number,
  statusId: number,
  title: string
}

export const HomeView = () => {

  const { active } = useFilter();
  const { user } = useAppContext();
  const [ tiles, setTiles ] = useState<SentForm[]>([]);

  const fetchForms = () => {
    fetch('http://localhost:8080/form/sent/'+user?.id, 
          {
            credentials: 'include', 
            mode: 'cors',
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(user?.id)
          })
        .then(res => res.json()
          .then(data => {
            if (res.ok) { //later, add internal server error handling(and other errors handling aswell)
              console.log('Response:', data);
              setTiles(data);
            }
          }).catch(err => {
            setTiles([]); //just in case
            console.log('Error parsing sent forms:', err)}
          )
        ).catch(err => console.log('Error receiving sent forms:', err));
  }

  useEffect(() => { 
    fetchForms()
  }, []);

  /*
  const tiles = [
    { id: 1, title: "Form A", status: "Accepted" },
    { id: 2, title: "Form B", status: "Pending" },
    { id: 3, title: "Form C", status: "Denied" },
    { id: 4, title: "Form C", status: "pending" },
  ];//placeholder
  */
 /*
  const filteredTiles =
      active === "all"
        ? tiles
        : tiles.filter((tile) => tile.status === active);
*/
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h1 className="text-2xl font-semibold mb-4">Home</h1>

      <Tiles tiles= {tiles} />

    </div>
  );
};
