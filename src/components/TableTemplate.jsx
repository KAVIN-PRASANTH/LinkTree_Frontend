import axios from "axios";
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';

function TableTemplate(props) {
    const [data, setData] = useState(props.data);
    function addLink() {
        Swal.fire({
            title: 'Enter Data',
            html:
                '<input id="swal-input2" class="swal2-input" placeholder="Name">' +
                '<input id="swal-input1" class="swal2-input" placeholder="Link">',
            showCancelButton: true,
            confirmButtonText: 'Submit',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const link = document.getElementById('swal-input1').value;
                const name = document.getElementById('swal-input2').value;
                await axios.post("https://linktreebackend-11oe.onrender.com/api/addLink", { link, name }).then(message => {
                    if (message.data.result === "success") {
                        setData(prevData => [...prevData, { link, name }]);
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
                }).catch((error) => {
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
                    setData(prevData => prevData.filter(row => row.link !== link));
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
    function editRow(link, name) {

        Swal.fire({
            title: 'Edit Data',
            html:
                `<input id="swal-input2" class="swal2-input" value="${name}">` +
                `<input id="swal-input1" class="swal2-input" value="${link}">`,
            cancelButtonText: 'Cancel',
            showCancelButton: true

        }).then(async (result) => {
            if (result.isConfirmed) {
                const newLink = document.getElementById('swal-input1').value;
                const name = document.getElementById('swal-input2').value;

                await axios.patch("https://linktreebackend-11oe.onrender.com/api/editLink", { oldLink: link, newLink, name }).then(message => {
                    if (message.data.success == "ok") {
                        setData(prevData => prevData.map(row => (row.link === link ? { link: newLink, name } : row)));
                        Swal.fire({
                            icon: 'success',
                            title: 'Data Edited Successfully',
                            confirmButtonText: 'OK'
                        });
                    }
                    else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Try again later',
                            confirmButtonText: 'OK'
                        });
                    }
                }).catch(error => {
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
        <div style={{ overflowX: "scroll" }}>
            <table className="table text-light " id="link_table" align="center">
                <thead>
                    <tr>
                        <th>Name</th>
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
                                <td>{`${row.name}`}</td>
                                <td style={{ textDecoration: "underline", color: "blue" }}><a href={`${row.link}`} target="_blank">{`${row.link}`}</a></td>
                                <td><button className="btn btn-success" onClick={() => copyText(`${row.link}`)}>Copy</button></td>
                                <td><button className="btn btn-primary" onClick={() => editRow(`${row.link}`, `${row.name}`)}>Edit</button></td>
                                <td><button className="btn btn-danger" onClick={() => deleteRow(`${row.link}`)}>Delete</button></td>
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
