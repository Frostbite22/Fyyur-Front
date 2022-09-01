import logo from './logo.svg';
import background from './music.jpg';
import './App.css';
import axios from "axios";
import {useEffect, useState} from 'react';


function NavBar(props) 
{
  
  const titles = props.titles ;
  return(
    <div className="topnav">
      {
        titles.map((title) => {
        return <a key={title} onClick={() => props.handleGet(title,props.setData,props.setTitle,props.setFormButton,props.setFields)}>{title}</a>
        })
      }
    </div>
    
  );
}

function FormatGetData({data})
{
  return (
    <div>
    {
      data.map((element)=> {
        return (
          <>
            <div key={element.id} className="formatData">
              {
                Object.entries(element).map( ([key,value]) => 
                { 
                  return (
                    
                    <div>
                      <span className='textSizeFont'>{key}</span> : <span className='valueColor'>{typeof value !== 'object'? value : Object.entries(value).map(([key,value])=> {
                        return(
                          <div>
                            {typeof value !== 'object' ? value : Object.entries(value).map(([key,value])=> {
                              return (
                                <div>
                                  <span className='textSizeFont'>{key}</span> : <span className='valueColor'>{value }</span>
                                </div>
                              )
                            })}
                          </div>
                        )
                      })}</span>
                    </div>
                  )
                }
                ) 
              }
            </div>
         </>
        )
      })
    }
  </div>

  )
}

function App() {
  
  const [changed,setChanged] = useState(false);
  const [fields,setFields] = useState([]);
  const [data,setData] = useState([]);
  const [title, setTitle] = useState("") ;
  const [formButton,setFormButton] = useState(true);
  function handleOnClick(formButton)
  {
      setFormButton(!formButton);
  }

  function handleGet(title,setData,setTitle,setFormButton,setFields)
  {
      axios({
        method: "GET",
        url : `/${title}`
      })
      .then(res => {
        const cleanFields = []
        const model = res.data[`${title}`];
        Object.entries(model[0]).map(([key,value])=> {
          cleanFields.push(key); 
        })
        setFields(cleanFields);
        setData(JSON.parse(JSON.stringify(model)));
      }) 
      setTitle(title);
      setFormButton(true);
  }

  function handleSubmit(event)
  {
    const newData = {} ; 
    newData[event.target.elements.name.id] = event.target.elements.name.value ;

    console.log(newData)
    axios({
      method: "post",
      url: "/create/genre",
      data: newData,
      headers: { "Content-Type": "application/json" },
    }).then(function (response) {
        //handle success
        setChanged(!changed);
        console.log(response);
      }).catch(function (response) {
        //handle error
        console.log(response);
      });
    
  }

  

  return (
    <div className="App">
      <NavBar titles={["artists","venues","shows","genres"]} setData={setData} setTitle={setTitle} setFormButton={setFormButton} setFields={setFields} handleGet={handleGet}/>
      <img className='background' alt="background" src={background} hidden={data==""? false : true}/>
      <div className="dataContainer" hidden={data==""? true : false}>
        <FormatGetData data={data}/>
      </div>
      <button className='btn' hidden={data==""? true : false} onClick={() => handleOnClick(formButton)}> {formButton===true ?`add ${title}`:"Hide" }</button>
      <form hidden={formButton} className="formLayout" onSubmit={handleSubmit}>
        <label htmlFor="name" hidden={formButton}>name 
        <input type="text" id="name" hidden={formButton}/>
        </label>
        <input type="submit" value="Submit" className='btn'/>

      </form>
    </div>
  );
}

export default App;
