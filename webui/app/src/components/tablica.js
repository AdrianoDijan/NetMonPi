import React from 'react'
import { DataGrid } from '@material-ui/data-grid';

let data = []

fetch("http://localhost:3080/api/v1/devices/all")
      .then(response => response.json())
      .then(podaci => {
          for (let i = 0;i < podaci.length; i++) {
            data.push(podaci[i])
          }
      })
      

  

   const columns = [
   {field:'id', headerName:'ID'},
   {field:'mac', headerName:'MAC', width: 120},
   {field:'netaddr', headerName:'Address'},
   {field:'ip', headerName:'IP'},
   {field:'hostname', headerName:'Hostname'},
   {field:'first_seen', headerName:'First_seen'},
   {field:'last_seen', headerName:'Last_seen'},
   {field:'vendor', headerName:'Vendor'}
 ]

 let rows = data;

 export default function BasicTable() {


     for (let i = 0; i < rows.length; i++) {
       rows[i]['id'] = i;
     }

     
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
    </div>
  );
}

