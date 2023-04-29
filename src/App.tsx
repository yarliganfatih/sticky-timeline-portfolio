import { useState } from "react";
import data from "./assets/data.json";

type Item = {
  id: number;
  name: string;
  count: number;
  [key: string]: string | number;
};

type SearchTerm = {
  name?: string;
  count?: number;
};

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>(data);
  const [searchTerm, setSearchTerm] = useState<SearchTerm>({});

  const filterItems = (searchTerm: SearchTerm) => {
    console.log(searchTerm);
    const filtered = data.filter((item: Item) => {
      let isMatch = true;
      Object.entries(searchTerm).forEach(([key, value]) => {
        if (
          value &&
          !item[key].toString().toLowerCase().includes(value.toString().toLowerCase())
        ) {
          isMatch = false;
        }
      });
      return isMatch;
    });
    setItems(filtered);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSearchTerm((prevSearchTerm) => ({ ...prevSearchTerm, [name]: value }));
    filterItems({ ...searchTerm, [name]: value });
  };

  return (
    <>
      <input
        name="name"
        type="text"
        placeholder="Name"
        onChange={handleChange}
      />
      <input
        name="count"
        type="number"
        placeholder="Count"
        onChange={handleChange}
      />
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} - {item.count}
          </li>
        ))}
      </ul>
    </>
  );
};

export default App;
