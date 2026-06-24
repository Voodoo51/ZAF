import {Tiles} from "../utils/Tiles";
import {useAppContext, useFilter} from "../App";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type SentForm = {
  id: number,
  templateId: number,
  statusId: number,
  title: string
}

export const HomeView = () => {
  const { t } = useTranslation();
  const { filterId } = useFilter();
  const { user } = useAppContext();
  const [ tiles, setTiles ] = useState<SentForm[]>([]);

  const fetchFormTemplates = () => {
        fetch("http://localhost:8080/form/templates",
              {
                method: "GET",
                credentials: "include"
              }
        )
        .then(res => res.json())
        .then(data => {
           const mappedTiles: SentForm[] = data.map(
            (item: any, index: number) => ({
                id: index + 1, // React key
                templateId: item.templateId, // backend template id
                statusId: item.statusId,
                title: item.title
            })
        );
        
            setTiles(mappedTiles);
        })
        .catch(err => {
            console.log(
                "Error fetching templates:",
                err
            );
        });
  }
const filteredTiles =
            filterId === -1
              ? tiles
              : tiles.filter((tile) => tile.statusId === filterId);

    useEffect(() => {
      fetchFormTemplates();
    }, []);
  /*
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
*/

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
      <h1 className="text-2xl font-semibold mb-4">{t("home.title")}</h1>

  <div className="max-h-[70vh] overflow-y-auto">
    <Tiles tiles={filteredTiles} />
  </div>
</div>
  );
};
