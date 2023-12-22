import axios from "axios";
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';

function TableTemplate(props) {
    const [data, setData] = useState(props.data);
    function addLink() {
        Swal.fire({
            title: 'Enter Link',
            input: 'text',
            inputLabel: 'Link URL',
            inputPlaceholder: 'https://example.com',
            showCancelButton: true,
            confirmButtonText: 'Submit',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const link = result.value;
                await axios.post("https://linktreebackend-11oe.onrender.com/api/addLink", { link: result.value }).then(message => {
                    if (message.data.result === "success") {
                        setData(prevData => [...prevData, link]);
                        Swal.fire({
                            icon: "success",
                            title: "Link Added Successfully"
                        })
                    }
                    else {
                        Swal.fire({
                            icon: "error",
                            title: "Try again later"
                        })
                    }
                }).catch((error)=>{
                    console.log(error);
                    Swal.fire({
                        icon: "error",
                        title: "Try again later"
                    });
                })

            }
        });
        
    }
    async function deleteRow(link) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then(async result => {
            if (result.isConfirmed) {
                await axios.delete("https://linktreebackend-11oe.onrender.com/api/deleteLink", { data: { id: link } }).then(message => {
                    setData(prevData => prevData.filter(row => row !== link));
                    if (message.data.success == "ok") {
                        Swal.fire({
                            icon: "success",
                            title: "Deleted successfully"
                        }
                        )
                    }
                    else {
                        Swal.fire({
                            icon: "error",
                            title: "Try again later"
                        })
                    }
                }).catch(error => {
                    console.log(error);
                    Swal.fire({
                        icon: "error",
                        title: "Try again later"
                    });
                })
            }
        })
        
    }
    function editRow(link){
        Swal.fire({
            title: 'Edit Data',
            input:"text",
            inputPlaceholder:"Enter new data",
            showCancelButton: true,
            confirmButtonText: 'Save',
            cancelButtonText: 'Cancel',
            
          }).then(async (result) => {
            console.log(result)
            if (result.isConfirmed) {
                const newDataValue = result.value;
                await axios.patch("https://linktreebackend-11oe.onrender.com/api/editLink",{oldLink:link,newLink:newDataValue}).then(message=>{
                    if(message.data.success=="ok")
                    {
                        setData(prevData => prevData.map(row => (row === link ? newDataValue : row)));
                        Swal.fire({
                            icon: 'success',
                            title: 'Data Edited Successfully',
                            confirmButtonText: 'OK'
                          });
                    }
                    else{
                        Swal.fire({
                            icon: 'error',
                            title: 'Try again later',
                            confirmButtonText: 'OK'
                          });
                    }
                }).catch(error=>{
                    Swal.fire({
                        icon: 'error',
                        title: 'Try again later',
                        confirmButtonText: 'OK'
                      });
                })
              
            }
          });
        
    }
    function copyText(text) {
        let textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        Swal.fire({
            icon: 'success',
            title: 'Text-Copied',
            confirmButtonColor: 'bg-success'
        });
    }
    return (
        <div style={{overflow:"scroll"}}>
            <table className="table text-light " id="link_table" align="center">
                <thead>
                    <tr>
                        <th>Link</th>
                        <th>Copy</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => {
                        return (
                            <tr key={index} >
                                <td style={{ textDecoration: "underline", color: "blue" }}><a href={`${row}`} target="_blank">{`${row}`}</a></td>
                                <td><button className="btn btn-success" onClick={() => copyText(`${row}`)}>Copy</button></td>
                                <td><button className="btn btn-primary" onClick={()=>editRow(`${row}`)}>Edit</button></td>
                                <td><button className="btn btn-danger" onClick={() => deleteRow(`${row}`)}>Delete</button></td>
                            </tr>
                        )
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={4} align="center">
                            <button className="btn bg-primary col-3 col-md-5 text-light" onClick={addLink}>+ Add</button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}

export default TableTemplate;
