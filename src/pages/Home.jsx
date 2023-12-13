import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";
import TableTemplate from '../components/TableTemplate';
import ClipLoader from "react-spinners/ClipLoader";

function Home() {
  const [display, setDisplay] = useState(false);
  const [dataArray, setDataArray] = useState([]);
  const [loading, setLoading] = useState(false);

  async function Validation() {
    Swal.fire({
      title: 'Enter Password',
      input: 'password',
      showCancelButton: true,
      confirmButtonText: 'Submit',
    }).then(async result => {
      setLoading(true);
      if (result.isConfirmed) {
        await axios.get("https://linktreebackend-11oe.onrender.com/api/authentication", { params: { password: result.value } })
          .then(message => {
            if (message.data.auth) {
              Swal.fire({
                icon: "success",
                title: "Password verified"
              }).then(async result => {
                if (result.isConfirmed) {
                  await axios.get("https://linktreebackend-11oe.onrender.com/api/getData")
                    .then(message => {
                      setLoading(false)
                      const newDataArray = message.data.map(item => item.link);
                      console.log(newDataArray);
                      setDataArray(newDataArray);
                      setDisplay(true);
                    })
                    .catch(error => console.log(error));
                }
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Password is incorrect!',
              });
            }
          })
          .catch(error => {
            console.log(error);
            Swal.fire({
              icon: "error",
              title: "Try again later"
            });
          }).finally(()=>{
            setLoading(false);
          });
      }
      else{setLoading(false)}
    });
  }

  return (
    <div>
      <div className='col-12 d-flex justify-content-center align-items-center'>
        {!loading && <div className='btn btn-danger col-6' style={{ cursor: 'pointer' }} onClick={Validation}>
          Private link
        </div>}

        {loading && <div className='btn btn-danger col-6' style={{ cursor: 'pointer' }} onClick={Validation}>
          <ClipLoader size={20} color='white'/>
        </div>}
      </div>
      <br />
      <div>
        {display &&
          <TableTemplate data={dataArray} />}
      </div>

    </div>
  );
}

export default Home;
