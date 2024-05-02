import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import PageHeaderCom from '../../../components/admin/PageHeaderCom';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Test = () => {
    const [user, setUser] = useState([])
    const getData = async () => {
        try {
            const result = await fetch(`http://localhost/deepak/php-test/api.php`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!result.ok) {
                throw new Error(`HTTP error! Status: ${result.status}`);
            }

            const res = await result.json();
            setUser(res.data)
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    const changeArrFilterData = () => {
        const result = user?.map((sponsor) =>
            ({ "SW ID": sponsor.sw_id, "Name": sponsor.sw_name, "Email": sponsor.sw_email })
        )
        console.log(result)
    }

    useEffect(() => {
        getData()
        changeArrFilterData()
    }, [])

    // const arr = [
    //     {
    //         sw_id: 1,
    //         sw_name: 'john',
    //         cliend_id: 5,
    //         cliend_name: 'mohan',
    //     },
    //     {
    //         sw_id: 1,
    //         sw_name: 'john',
    //         cliend_id: 7,
    //         cliend_name: 'jugesh',
    //     },
    //     {
    //         sw_id: 2,
    //         sw_name: 'deepak',
    //         cliend_id: 7,
    //         cliend_name: 'hira',
    //     }
    // ]

    const groupBySwId = (arr) => {
        return arr.reduce((groups, item) => {
            const { sw_id, sw_name, sw_email, client_id, client_name, time_spent } = item;

            if (!groups[sw_id]) {
                groups[sw_id] = {
                    sw_id,
                    sw_name,
                    sw_email,
                    clients: [],
                };
            }

            groups[sw_id].clients.push({
                client_id,
                client_name,
                time_spent,
            });

            return groups;
        }, {});
    };

    console.log("user",user)
    const total = user.reduce((acc, curr) => acc + parseFloat(curr.time_spent), 0);
console.log("DEEEEEEEEEEEEEEEEEEEEEE",total);

    const groupedData = Object.values(groupBySwId(user));
    const maxClients = Math.max(...groupedData.map((group) => group.clients.length));
    const clientHeaders = Array.from({ length: maxClients }, (_, index) => `Client ${index + 1}`);
    console.log(clientHeaders)
    const columns = [
        {
            name: 'SW ID',
            selector: row => row.sw_id,
            sortable: true
        },
        {
            name: <span className='text-uppercase'>SW Name</span>,
            selector: row => row.sw_name,
        },
        {
            name: <span className='text-uppercase'>sw email</span>,
            selector: row => row.sw_email,
        },
        {
            name: <span className='text-uppercase'>client id</span>,
            selector: row => row.client_id,
        },
        {
            name: <span className='text-uppercase'>client name</span>,
            selector: row => row.client_name,
        },
        {
            name: <span className='text-uppercase'>client email</span>,
            selector: row => row.client_email,
        },
        {
            name: <span className='text-uppercase'>time</span>,
            selector: row => row.time_spent,
        },

    ];

    // const exportdata = () => {

    // }
    const handleDownloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(user);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        XLSX.writeFile(workbook, '1-6-2023–28-2-2024.xlsx');
    };

    const exportToExcel = () => {
        const groupedData = user.reduce((groups, item) => {
            const { sw_id, sw_name, sw_email, client_name, time_spent } = item;

            if (!groups[sw_id]) {
                groups[sw_id] = {
                    sw_name,
                    sw_email,
                    clients: [],
                };
            }

            groups[sw_id].clients.push({ client_name, time_spent });
            return groups;
        }, {});

        const dataForSheet = Object.values(groupedData).map((group) => {
            const clientData = group.clients.reduce((acc, client, index) => {
                acc[`Client ${index + 1}`] = client.client_name;
                acc[`Time Spent ${index + 1}`] = client.time_spent;
                return acc;
            }, {});

            return {
                'SW ID': group.sw_id,
                'SW Name': group.sw_name,
                'SW Email': group.sw_email,
                ...clientData,
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(dataForSheet);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        XLSX.writeFile(workbook, 'ddd.xlsx');
    };
    return (
        <>
            <div className="content-wrapper">
                {/* Content */}
                <div className="container-xxl flex-grow-1 container-p-y">
                    <button onClick={exportToExcel}>Export to Excel {user.length}</button>
                    <button onClick={handleDownloadExcel}>Export to Excel 1 {user.length}</button>
                    {/* <PageHeaderCom pageTitle="Product" link='/admin/add-products' linkBtnName={'add product'} /> */}
                    {/* <div className="card mb-4">
                <div className="card-widget-separator-wrapper">
                    <div className="card-body card-widget-separator">
                        <div className="row gy-4 gy-sm-1">
                            <div className="col-sm-6 col-lg-3">
                                <div className="d-flex justify-content-between align-items-start card-widget-1 border-end pb-3 pb-sm-0">
                                    <div>
                                        <h6 className="mb-2">In-store Sales</h6>
                                        <h4 className="mb-2">$5,345.43</h4>
                                        <p className="mb-0"><span className="text-muted me-2">5k orders</span><span className="badge bg-label-success">+5.7%</span></p>
                                    </div>
                                    <span className="avatar me-sm-4">
                                        <span className="avatar-initial bg-label-secondary rounded"><i className="ti-md ti ti-smart-home text-body" /></span>
                                    </span>
                                </div>
                                <hr className="d-none d-sm-block d-lg-none me-4" />
                            </div>
                            <div className="col-sm-6 col-lg-3">
                                <div className="d-flex justify-content-between align-items-start card-widget-2 border-end pb-3 pb-sm-0">
                                    <div>
                                        <h6 className="mb-2">Website Sales</h6>
                                        <h4 className="mb-2">$674,347.12</h4>
                                        <p className="mb-0"><span className="text-muted me-2">21k orders</span><span className="badge bg-label-success">+12.4%</span></p>
                                    </div>
                                    <span className="avatar p-2 me-lg-4">
                                        <span className="avatar-initial bg-label-secondary rounded"><i className="ti-md ti ti-device-laptop text-body" /></span>
                                    </span>
                                </div>
                                <hr className="d-none d-sm-block d-lg-none" />
                            </div>
                            <div className="col-sm-6 col-lg-3">
                                <div className="d-flex justify-content-between align-items-start border-end pb-3 pb-sm-0 card-widget-3">
                                    <div>
                                        <h6 className="mb-2">Discount</h6>
                                        <h4 className="mb-2">$14,235.12</h4>
                                        <p className="mb-0 text-muted">6k orders</p>
                                    </div>
                                    <span className="avatar p-2 me-sm-4">
                                        <span className="avatar-initial bg-label-secondary rounded"><i className="ti-md ti ti-gift text-body" /></span>
                                    </span>
                                </div>
                            </div>
                            <div className="col-sm-6 col-lg-3">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 className="mb-2">Affiliate</h6>
                                        <h4 className="mb-2">$8,345.23</h4>
                                        <p className="mb-0"><span className="text-muted me-2">150 orders</span><span className="badge bg-label-danger">-3.5%</span></p>
                                    </div>
                                    <span className="avatar p-2">
                                        <span className="avatar-initial bg-label-secondary rounded"><i className="ti-md ti ti-wallet text-body" /></span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
                    {/* <div className="card">
                <div className="card-datatable table-responsive">
                    <DataTable
                        columns={columns}
                        data={user}
                        // dense
                        highlightOnHover
                        selectableRowsHighlight
                        pagination
                        selectableRows
                    />
                </div>
            </div> */}
                    <div className="card">
                        <div className="card-datatable table-responsive">
                            <table className='table'>
                                <thead>
                                    <tr>
                                        {/* <th>SW ID</th> */}
                                        <th>SW Name</th>
                                        <th>SW Email</th>
                                        {clientHeaders.map((header, index) => (
                                            <>
                                                <th key={index}>{header}</th>
                                                <th key={index}>{'Total Time Spent'}</th>
                                            </>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupedData.map((group) => (
                                        <tr key={group.sw_id}>
                                            {/* <td>{group.sw_id}</td> */}
                                            <td>{group.sw_name}</td>
                                            <td>{group.sw_email}</td>
                                            {group.clients.map((client, index) => (
                                                <>
                                                    <td key={index}>{client.client_name} ({client.time_spent})</td>
                                                    <td key={index}>({client.time_spent})</td>
                                                </>
                                            ))}
                                            {Array.from({ length: maxClients - group.clients.length }).map((_, index) => (
                                                <td key={index}></td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="content-backdrop fade" />
            </div>

        </>
    )
}

export default Test