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
                <p><strong>Dodavatel:</strong>{invoice.seller?.name} TO DO</p>
                <p><strong>Odběratel:</strong> {invoice.buyer?.name} TO DO</p>
                <p>Zaplatit do: {invoice.dueDate}</p>
                <p>Položky: {invoice.product}</p>
                <p>Cena: {invoice.price} Kč</p>
                <p>DPH: {invoice.vat}</p>
                <p>Poznámky: {invoice.note}</p>
            </div>
        </>
    );
};
export default InvoiceDetail;