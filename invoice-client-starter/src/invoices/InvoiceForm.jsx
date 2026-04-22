/*
Upraví nebo vytvoří novou fakturu
*/

import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

import {apiGet, apiPost, apiPut} from "../utils/api";

import InputField from "../components/InputField";
import InputCheck from "../components/InputCheck";
import FlashMessage from "../components/FlashMessage";


const InvoiceForm = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const [sellers, setSellers] = useState([]);
    const [buyers, setBuyers] = useState([]);
    const [invoice, setInvoice] = useState({
        invoiceNumber: "",
        seller: "",
        buyer: "",
        issued: "",
        dueDate: "",
        product: "",
        price: "",
        vat: "",
        note: ""
    });
    const [sentState, setSent] = useState(false);
    const [successState, setSuccess] = useState(false);
    const [errorState, setError] = useState(null);

    useEffect(() => {
        if (id) {
            apiGet("/api/invoices/" + id).then((data) => setInvoice(data));
        }
    }, [id]);

    useEffect(() => {
        apiGet("/api/persons").then((data) => {
            setSellers(data);
            setBuyers(data);
        });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        (id ? apiPut("/api/invoices/" + id, invoice) : apiPost("/api/invoices", invoice))
            .then((data) => {
                setSent(true);
                setSuccess(true);
                navigate("/invoices");
            })
            .catch((error) => {
                console.log(error.message);
                console.log("RESPONSE", error.response);
                setError(error.message);
                setSent(true);
                setSuccess(false);
            });
    };

    const sent = sentState;
    const success = successState;

    return (
        <div>
            <h1>{id ? "Upravit" : "Vytvořit"} fakturu</h1>
            <hr/>
            {errorState ? (
                <div className="alert alert-danger">{errorState}</div>
            ) : null}
            {sent && (
                <FlashMessage
                    theme={success ? "success" : ""}
                    text={success ? "Uložení faktury proběhlo úspěšně." : ""}
                />
            )}
            <form onSubmit={handleSubmit}>
                <InputField
                    required={true}
                    type="text"
                    name="InvoiceNumber"
                    min="7"
                    label="Číslo faktury"
                    prompt="Zadejte číslo faktury"
                    value={invoice.invoiceNumber}
                    handleChange={(e) => {
                        setInvoice({...invoice, invoiceNumber: Number(e.target.value) });
                    }}
                />

                <label>Dodavatel:</label>
                <br></br>
                <select required value={invoice.seller} onChange={(e) => {
                        const value = e.target.value;
                        setInvoice({...invoice, seller: value === "" ? "" : Number(value), });
                    }}
                >
                
                    <option value=""> -- vyber dodavatele --</option>

                    {sellers.map((seller) => (
                        <option key={seller._id} value={seller._id}>
                            {seller.name}
                        </option>
                    ))}
                </select>
                <br></br>

                <label>Odběratel:</label>
                <br></br>
                <select required value={invoice.buyer} onChange={(e) => {
                        const value = e.target.value;
                        setInvoice({...invoice, buyer: value === "" ? "" : Number(value), });
                    }}
                >
                
                    <option value=""> -- Vyber odběratele --</option>

                    {buyers.map((buyer) => (
                        <option key={buyer._id} value={buyer._id}>
                            {buyer.name}
                        </option>
                    ))}
                </select>

                <InputField
                    required={true}
                    type="text"
                    name="Issued"
                    min="8"
                    label="Datum vystavení"
                    prompt="Zadejte datum vystavení"
                    value={invoice.issued}
                    handleChange={(e) => {
                        setInvoice({...invoice, issued: e.target.value});
                    }}
                />

                <InputField
                    required={true}
                    type="text"
                    name="DueDate"
                    min="8"
                    label="Datum splatnosti"
                    prompt="Zadejte datum splatnosti"
                    value={invoice.dueDate}
                    handleChange={(e) => {
                        setInvoice({...invoice, dueDate: e.target.value});
                    }}
                />

                <InputField
                    required={true}
                    type="text"
                    name="Product"
                    min="2"
                    label="Předmět faktury"
                    prompt="Zadejte předmět faktury"
                    value={invoice.product}
                    handleChange={(e) => {
                        setInvoice({...invoice, product: e.target.value});
                    }}
                />

                <InputField
                    required={true}
                    type="text"
                    name="Price"
                    min="1"
                    label="Cena"
                    prompt="Zadejte cenu v Kč bez mezer"
                    value={invoice.price}
                    handleChange={(e) => {
                        setInvoice({...invoice, price: Number(e.target.value) });
                    }}
                />

                <InputField
                    required={true}
                    type="text"
                    name="VAT"
                    min="2"
                    label="DPH"
                    prompt="Zadejte DPH %"
                    value={invoice.vat}
                    handleChange={(e) => {
                        setInvoice({...invoice, vat: Number(e.target.value) });
                    }}
                />

                <InputField
                    required={false}
                    type="text"
                    name="Note"
                    min="1"
                    label="Poznámka"
                    prompt="Poznámka"
                    value={invoice.note}
                    handleChange={(e) => {
                        setInvoice({...invoice, note: e.target.value});
                    }}
                />

                <input type="submit" className="btn btn-primary" value="Uložit"/>
            </form>
        </div>
    );
};

export default InvoiceForm;