import { useEffect, useState } from 'react';
import { SearchInput,IconButton, Button, CloudDownloadIcon, TickIcon,TextInput } from 'evergreen-ui'
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import JsPDF from 'jspdf';

const report = new JsPDF('portrait','px','a4');

const generatePDF = () => {
  report.html(document.querySelector('#report')).then(() => {
    
    report.save('acronyme_cfp02.pdf');
})}


const AddAcro = (props) => {

  fetch('http://localhost:1337/api/accronyme', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    data: {
      acronyme: 'TEST',
    },
  }),
})
  .then(response => response.json())
  .then(data => console.log(data));
}


function SearchBar(props) {
  const [searchVal, setSearchVal] = useState('');

  const handleInput = (e) => {
    setSearchVal(e.target.value);
  }

  const handleClearBtn = () => {
    setSearchVal('');
  }

  const filteredProducts = props.products.filter((product) => {
    return product.includes(searchVal);
  });

  return (

    <div className='container searchresult'>
      <SearchInput
        onChange={handleInput}
        value={searchVal.toUpperCase()}
        type="text"
        name="product-search"
        id="product-search"
        placeholder="Rechercher"
        className='search-input'
      />
      <Button className='dl-btn' marginY={8} marginRight={12} iconAfter={CloudDownloadIcon} onClick={generatePDF} type="button">Télécharger en PDF</Button>
      <br></br>
      <TextInput value="" name="text-input-name" placeholder="CFP..." />
      <IconButton className='dl-btn' onClick={AddAcro} icon={TickIcon} intent="success" />



      <div className='input-wrap'>
        <i className="fas fa-search"></i>
        <i
          onClick={handleClearBtn}
          className="fas fa-times"
        ></i>
      </div>

      <div  id='report' className="results-wrap">


      <ListGroup as="ol" numbered>
      {filteredProducts.map((product) => {
        return <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
        <div className="ms-2 me-auto">
          <div className="fw-bold">{product}</div>
        </div>
      </ListGroup.Item>
            })}
    </ListGroup>
      </div>
    </div>
  );
}
// Parses the JSON returned by a network request
const parseJSON = (resp) => (resp.json ? resp.json() : resp);

// Checks if a network request came back fine, and throws an error if not
const checkStatus = (resp) => {
  if (resp.status >= 200 && resp.status < 300) {
    return resp;
  }

  return parseJSON(resp).then(resp => {
    throw resp;
  });
};

const headers = { 'Content-Type': 'application/json' };








function App() {
  const [error, setError] = useState(null);
  const [acronymes, setAcronymes] = useState([]);


  useEffect(() => {
    fetch('http://localhost:1337/api/accronyme?pagination[start]=0&pagination[limit]=200', { headers, method: 'GET' })
      .then(checkStatus)
      .then(parseJSON)
      .then(({ data }) => setAcronymes(data))
      .catch((error) => setError(error))
  }, [])

  if (error) {
    // Print errors if any
    return <div>An error occured: {error.message}</div>;
  }


  let products = [];
  acronymes.map(({ attributes }) => products.push(attributes.acronyme))


  return (
    <div>
      <Navbar className="color-nav" variant="dark">
        <Container fluid>
          <Navbar.Brand href="#home">
            <img
              src="/logo.png"
              width="120"
              height="80"
              className="d-inline-block align-top"
              alt="CFP02"
            />
          </Navbar.Brand>
        </Container>
      </Navbar>
      <SearchBar products={products} />
    </div>
  );
}

export default App;