import React, { useState } from 'react'
import { observer } from 'mobx-react';
import axios from 'axios';
import Message from './Message';
import Progress from './Progress';
import Table from './Table';
import History from './History';
import UserStore from './UserStore';

const FileUpload = () => {

  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('Choose file');
  const [uploadedFile, setUploadedFile] = useState('');
  const [message, setMessage] = useState('');
  const [uploadedPercentage, setUploadedPercentage] = useState(0);
  const [minsup, setMinsup] = useState(0.05);
  const [minconf, setMinconf] = useState(0.9);
  const [maxoutput, setMaxoutput] = useState(10);
  const [rows, setRows] = useState([]);
  const [sort, setSort] = useState('');
  const [history, setHistory] = useState([]);
  var history_page = true;

  function createData(rule, sup, conf, conv, lift) {
    return { rule, sup, conf, conv, lift };
  }

  function parser(array){
    let result = [];
    for(let i=0;i<array.length;i++){
      result.push(createData(array[i][0],array[i][1],array[i][2],array[i][3],array[i][4]));
    }
    return result;
  }

  function createHist(time,csv,min_sup,min_conf,max_output,sort) {
    return { time,csv,min_sup,min_conf,max_output,sort };
  }

  function parserhist(array){
    let result = [];
    if(array.length>10){
      for(let i=0;i<10;i++){
        result.push(createHist(array[i].time,array[i].csv,array[i].min_sup,array[i].min_conf,array[i].max_output,array[i].sort));
      }
    }
    else{
      for(let i=0;i<array.length;i++){
        result.push(createHist(array[i].time,array[i].csv,array[i].min_sup,array[i].min_conf,array[i].max_output,array[i].sort));
      }
    }
    return result;
  }

  const onClick = async e => {
    UserStore.history = !UserStore.history;
    try{
      const res = await axios.get('/history',  {});
      setHistory(parserhist(res.data.history));
      console.log(res)
    } catch (error) {
      }
  }
  
  const onChange = e => {
    if (e.target.files[0]){
      setFile(e.target.files[0]);
      setFilename(e.target.files[0].name);
    }
  }

  const onChangeSup = e => {
    setMinsup(e.target.value);
  }

  const onChangeConf = e => {
    setMinconf(e.target.value);
  }  

  const onChangeSort = e => {
    setSort(e.target.value);
  }  
  const onChangeMaxoutput = e => {
    setMaxoutput(e.target.value);
  }  

  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('minsup', minsup);
    formData.append('minconf', minconf);
    formData.append('maxoutput', maxoutput);
    formData.append('sort', sort);
    setUploadedPercentage(0);
    try {
      const res = await axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: progressEvent => {
          setUploadedPercentage(parseInt(Math.round(progressEvent.loaded * 100 / progressEvent.total)));
          //clear
          setTimeout( ()=>{ setUploadedPercentage(0); }, 10000 )
        }
        
      });
      setRows(parser(res.data.rules));
      setMessage('File Uploaded!');
    } catch (error) {
      if(error.response.status === 500){
        setMessage('problem with server');
        setUploadedPercentage(0);
      } else {
        setMessage(error.response.data.msg);
        setUploadedPercentage(0);
      }
    }
  }

  return (
    <>
      {UserStore.history ?
      <div>   
      {message ? <Message msg={message} /> : null}
      <form onSubmit={onSubmit}>
        <div className="custom-file mb-4">
          <input type="file" className="custom-file-input" id="customFile" accept=".csv" onChange={onChange} />
          <label className="custom-file-label" htmlFor="customFile">{filename}</label>
        </div>

        <div>
          <label className="mr-2">Min Sup:</label>
          <input type="number" value ={minsup} min='0.01' max='1' step='0.01' onChange={onChangeSup} />
          <label className="ml-4 mr-2">Min Conf:</label>
          <input type="number" value ={minconf} min='0.01' max='1' step='0.01' onChange={onChangeConf}/>
          <label className="ml-4 mr-2">Max Output:</label>
          <input type="number" value ={maxoutput} min='1' max='100' step='1' onChange={onChangeMaxoutput}/>
          <label className="ml-4 mr-2" >Sorted By:</label>
          <select onChange={onChangeSort}>
            <option value="">Default</option>
            <option value="sup">Support</option>
            <option value="conf">Confidence</option>
            <option value="conv">Conviction</option>
            <option value="lift">Lift</option>
          </select>
        </div>
        <div className="mt-4">
          <Progress percentage={uploadedPercentage} />
        </div>
        <input className="btn btn-primary btn-block mt-4" type="submit" value="Submit" />
      </form>
      <div className="mt-4 mb-4">
        <Table rowin = {rows}/>
      </div> 
      <button className="btn btn-primary btn-block mt-4 mb-4" type="button" onClick={onClick}>History</button>
      </div>
      :
      <div> 
      <History rowin = {history}/>
      <button className="btn btn-primary btn-block mt-4 mb-4" type="button" onClick={onClick}>Back</button>
      </div>
      }
    </>
  )
}


export default observer(FileUpload);
