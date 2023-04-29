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

  const andFilterItems = (searchTerm: SearchTerm) => {
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

  const orFilterItems = (searchTerm: SearchTerm) => {
    const filtered = data.filter((item: Item) => {
      const matches = Object.entries(searchTerm).map(([key, value]) => {
        if (value) {
          return item[key]
            .toString()
            .toLowerCase()
            .includes(value.toString().toLowerCase());
        }
        return true;
      });
      return matches.includes(true);
    });
    setItems(filtered);
  };

  const fillSearchTerm = (_value:string) => {
    let _searchTerm: SearchTerm = {};
    Object.entries(data[0]).forEach(([key]) => {
      _searchTerm = {..._searchTerm, [key]: _value};
    });
    setSearchTerm(_searchTerm);
    orFilterItems(_searchTerm);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSearchTerm((prevSearchTerm) => ({ ...prevSearchTerm, [name]: value }));
    andFilterItems({ ...searchTerm, [name]: value });
  };

  return (
    <>
      <form>
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
        <input
          name="query"
          type="text"
          placeholder="Query"
          onChange={(e) => { fillSearchTerm(e.target.value); }}
        />
        <input
          name="reset"
          type="reset"
          value="Reset"
          onClick={() => { fillSearchTerm(""); }}
        />
      </form>
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
