/*
Vymaže fakturu
*/

import React, {useEffect, useState} from "react";

import {apiDelete, apiGet} from "../utils/api";

import InvoiceTable from "./InvoiceTable";
import InputField from "../components/InputField";

const InvoiceIndex = () => {
    const [invoices, setInvoices] = useState([]);
    const [filterState, setFilter] = useState({
        buyerID: undefined,
        sellerID: undefined,
        product: undefined,
        fromYear: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        limit: undefined,
    });

    const deleteInvoice = async (id) => {
        try {
            await apiDelete("/api/invoices/" + id);
        } catch (error) {
            console.log(error.message);
            alert(error.message)
        }
        setInvoices(invoices.filter((item) => item._id !== id));
    };

    useEffect(() => {
        apiGet("/api/invoices").then((data) => setInvoices(data));
    }, []);  /* [] - prázdné pole závislostí znamená, že se funkce useEffect volá jednou, pokud toto chybí, zacyklí se */

    const handlesubmit = async (e) => {
        e.preventDefault()
        const data = await apiGet("/api/invoices", filterState);
                setInvoices(data);
    }
    
    return (
        <div>
            
            <form onSubmit={handlesubmit}>

                <InputField
                required={false}
                type="text"
                name="product"
                min="2"
                label="Produkt"
                prompt="Zadejte název produktu"
                value={filterState.product}
                handleChange={(e) => {
                    setFilter({...filterState, product: (e.target.value),});
                }}
                />            

                <InputField
                required={false}
                type="number"
                name="minPrice"
                min="1"
                label="Minimální cena"
                prompt="Zadejte minimální cenu"
                value={filterState.minPrice}
                handleChange={(e) => {
                    setFilter({...filterState, minPrice: (e.target.value),});
                }}
                />
                
                <InputField
                required={false}
                type="number"
                name="maxPrice"
                min="1"
                label="Maximální cena"
                prompt="Zadejte maximální cenu"
                value={filterState.maxPrice}
                handleChange={(e) => {
                    setFilter({...filterState, maxPrice: (e.target.value),});
                }}
                />

                <InputField
                required={false}
                type="number"
                name="limit"
                min="1"
                label="Limit zobrazení"
                prompt="Zadejte limit pro zobrazení počtu faktur"
                value={filterState.limit}
                handleChange={(e) => {
                    setFilter({...filterState, limit: (e.target.value),});
                }}
                />  
                
                <button type="submit">
                    Filtruj faktury
                </button>
            </form>
            
            <h1>Seznam faktur</h1>

            <InvoiceTable
                deleteInvoice={deleteInvoice}
                items={invoices}
                label="Počet faktur:"
            />

            
        </div>
    );
};
export default InvoiceIndex; /* default říká, že exportuji jen jednu věc ze seznamu */