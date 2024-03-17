import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Flex, Input, Button } from '@chakra-ui/react';

const testConnection = 'https://localhost:7210/Database/testConnection';
const search1 = 'https://localhost:7210/Database/search?searchQuery=oHdE.k';
const search2 = 'https://localhost:7210/Database/search?searchQuery=ohDe_i';
const search3 = 'https://localhost:7210/Database/search?searchQuery=ura o';
const search4 = 'https://localhost:7210/Database/search?searchQuery=sdgggdsdgdgfdfg';

const HomePage = () => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    console.log('search click');
    const searchUrl = `https://localhost:7210/Database/search?searchQuery=${encodeURIComponent(query)}`;

    axios
      .get(searchUrl, {
        headers: {
          ConnectionString: 'Server=localhost;Database=YLVA;Trusted_Connection=True;',
        },
      })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <Flex direction="column">
      <Input placeholder="Kirjoita hakukysely" value={query} onChange={e => setQuery(e.target.value)} mt={4} />
      <Button onClick={handleSearch} mt={4}>
        Tee haku
      </Button>
    </Flex>
  );
};

export default HomePage;
