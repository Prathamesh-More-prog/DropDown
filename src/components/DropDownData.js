import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import "./DropDownData.css"


const data = {
    india: [
        { id: 1, name: 'Rahul', score: '200' },
        { id: 2, name: 'Sachin', score: '150' },
        { id: 3, name: 'Ganesh', score: '1000' },
        { id: 4, name: 'Ganesh', score: '1000' },
        { id: 5, name: 'Ganesh', score: '1000' },
        { id: 6, name: 'Ganesh', score: '1000' },
        { id: 7, name: 'Ganesh', score: '1000' },
        { id: 8, name: 'Ganesh', score: '1000' },
        { id: 9, name: 'Ganesh', score: '1000' },
        { id: 10, name: 'Ganesh', score: '1000' },
        { id: 11, name: 'Ganesh', score: '1000' },

    ],
    pakistan: [
        { id: 1, name: 'Wasim', score: '100' },
        { id: 2, name: 'Javed', score: '80' },
    ],
    SA: [
        { id: 1, name: 'Jonty', score: '100' },
        { id: 5, name: 'Christ', score: '200' },],
    Bangladesh: [
        { id: 1, name: 'Mohammed', score: '110' },

    ]
};

const DropDownData = () => {
    const [selectedCountry, setSelectedCountry] = useState('india');
    const [tableData, setTableData] = useState(data[selectedCountry]);

    useEffect(() => {
        setTableData(data[selectedCountry]);
    }, [selectedCountry]);

    const handleDownload = (format) => {
        let fileType, fileExtension;
        if (format === 'csv') {
            fileType = 'text/csv';
            fileExtension = 'csv';
        } else if (format === 'json') {
            fileType = 'application/json';
            fileExtension = 'json';
        } else {
            throw new Error(`Unsupported format: ${format}`);
        }

        const fileName = `${selectedCountry}_data.${fileExtension}`;
        const fileData = (format === 'csv')
            ? tableData.map((row) => Object.values(row).join(',')).join('\n')
            : JSON.stringify(tableData);
        const file = new Blob([fileData], { type: fileType });
        saveAs(file, fileName);
    };


    const handleDownloadxlsx = () => {
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        const fileExtension = 'xlsx';
        const fileName = `${selectedCountry}_data.${fileExtension}`;

        const worksheet = XLSX.utils.json_to_sheet(tableData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const xlsxData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([xlsxData], { type: fileType });
        saveAs(file, fileName);
    }


    const handleDownloadPdf = (format) => {

        const fileType = 'application/pdf';
        const fileExtension = 'pdf';
        const fileName = `${selectedCountry}_data.${fileExtension}`;

        const columns = Object.keys(tableData[0]);
        const rows = tableData.map((row) => Object.values(row));

        const pdfDoc = new jsPDF();
        pdfDoc.autoTable({
            head: [columns],
            body: rows,
        });
        const pdfData = pdfDoc.output('blob');
        const file = new Blob([pdfData], { type: fileType });

        saveAs(file, fileName);
    }


    const columns = [
        { name: 'ID', selector: 'id', sortable: true },
        { name: 'Name', selector: 'name', sortable: true },
        { name: 'Score', selector: 'score', sortable: true }
    ];

    return (
        <div id='dropdown'>
            <div className='option'>
                <select value={selectedCountry} onChange={(event) => setSelectedCountry(event.target.value)}>
                    <option value="india">India</option>
                    <option value="pakistan">pakistan</option>
                    <option value="SA">SA</option>
                    <option value="Bangladesh">Bangladesh</option>
                </select>
            </div>
            <DataTable columns={columns} data={tableData} />
            <div id='button'>
                <button onClick={() => handleDownloadPdf('pdf')}>Download PDF</button>
                <button onClick={() => handleDownloadxlsx('xlsx')}>Download Excel</button>
                <button onClick={() => handleDownload('csv')}>Download CSV</button>
            </div>

        </div>
    );
};

export default DropDownData;