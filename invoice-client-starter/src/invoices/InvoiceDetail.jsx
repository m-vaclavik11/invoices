/*
Zobrazí detail faktury
*/

import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {apiGet} from "../utils/api";

const InvoiceDetail = () => {
    const {id} = useParams();
    const [invoice, setInvoice] = useState({});

    useEffect(() => {
        apiGet("/api/invoices/" + id)
        .then((data) => {
            setInvoice(data);
        })
        .catch((error) => {
            console.error(error);
        })
    }, [id]);



    return (
        <>
            <div>
                <h1>Detail faktury</h1>
                <hr/>
                <h3>{invoice.invoiceNumber} ({invoice._id})</h3>
                <p><strong>Issued by:</strong>{invoice.seller?.name} TO DO</p>
                <p><strong>Issued to:</strong> {invoice.buyer?.name} TO DO</p>
                <p>Due Date: {invoice.dueDate}</p>
                <p>Product: {invoice.product}</p>
                <p>Price: {invoice.price} Kč</p>
                <p>VAT: {invoice.vat}</p>
                <p>Note: {invoice.note}</p>
            </div>
        </>
    );
};
export default InvoiceDetail;