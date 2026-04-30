/*  _____ _______         _                      _
 * |_   _|__   __|       | |                    | |
 *   | |    | |_ __   ___| |___      _____  _ __| | __  ___ ____
 *   | |    | | '_ \ / _ \ __\ \ /\ / / _ \| '__| |/ / / __|_  /
 *  _| |_   | | | | |  __/ |_ \ V  V / (_) | |  |   < | (__ / /
 * |_____|  |_|_| |_|\___|\__| \_/\_/ \___/|_|  |_|\_(_)___/___|
 *                                _
 *              ___ ___ ___ _____|_|_ _ _____
 *             | . |  _| -_|     | | | |     |  LICENCE
 *             |  _|_| |___|_|_|_|_|___|_|_|_|
 *             |_|
 *
 *   PROGRAMOVÁNÍ  <>  DESIGN  <>  PRÁCE/PODNIKÁNÍ  <>  HW A SW
 *
 * Tento zdrojový kód je součástí výukových seriálů na
 * IT sociální síti WWW.ITNETWORK.CZ
 *
 * Kód spadá pod licenci prémiového obsahu a vznikl díky podpoře
 * našich členů. Je určen pouze pro osobní užití a nesmí být šířen.
 * Více informací na http://www.itnetwork.cz/licence
 */

import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

import Country from "./Country";
import {apiGet} from "../utils/api";
import InvoiceTable from "../invoices/InvoiceTable";

const PersonDetail = () => {
    const {id} = useParams();
    const {identificationNumber} = useParams
    const [person, setPerson] = useState({});
    const [salesInvoices, setSalesInvoices] = useState([])
    const [purchasesInvoices, setPurchasesInvoices] = useState([])

    useEffect(() => {
        apiGet("/api/persons/" + id)
        .then((data) => {
            setPerson(data);
        })
        .catch((error) => {
            console.error(error);
        })
    }, [id]);

    useEffect(() => {
        apiGet("/api/identification/" + person.identificationNumber + "/sales")
        .then((data) => {
            setSalesInvoices(data);
            console.log(data)
        })
        .catch((error) => {
            console.error(error);
        })
    }, [person.identificationNumber]);
    
    useEffect(() => {
        apiGet("/api/identification/" + person.identificationNumber + "/purchases")
        .then((data) => {
            setPurchasesInvoices(data);
            console.log(data)
        })
        .catch((error) => {
            console.error(error);
        })
    }, [person.identificationNumber]);

        // TODO: Add HTTP req.
    const country = Country.CZECHIA === person.country ? "Česká republika" : "Slovensko";

    return (
        <>
            <div>
                <div>
                    <h1>Detail osoby</h1>
                    <hr/>
                    <h3>{person.name} ({person.identificationNumber})</h3>
                    <p>
                        <strong>DIČ:</strong>
                        <br/>
                        {person.taxNumber}
                    </p>
                    <p>
                        <strong>Bankovní účet:</strong>
                        <br/>
                        {person.accountNumber}/{person.bankCode} ({person.iban})
                    </p>
                    <p>
                        <strong>Tel.:</strong>
                        <br/>
                        {person.telephone}
                    </p>
                    <p>
                        <strong>Mail:</strong>
                        <br/>
                        {person.mail}
                    </p>
                    <p>
                        <strong>Sídlo:</strong>
                        <br/>
                        {person.street}, {person.city},
                        {person.zip}, {country}
                    </p>
                    <p>
                        <strong>Poznámka:</strong>
                        <br/>
                        {person.note}
                    </p>
                    
                </div>
                    <p>
                        <strong>Počet vystavených faktur: {salesInvoices.length} </strong>
                    </p>
                        <table className="table table-bordered">
                                        <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Číslo faktury</th>
                                            <th>Dodavatel</th>
                                            <th>Odběratel</th>
                                            <th>Cena</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {salesInvoices.map((invoice, index) => (
                                            <tr key={index + 1}>
                                                <td>{index + 1}</td>
                                                <td>{invoice.invoiceNumber}</td>
                                                <td>{invoice.seller?.name}</td>
                                                <td>{invoice.buyer?.name}</td>
                                                <td>{invoice.price}</td>
                                                
                                            </tr>
                                        ))}
                                        </tbody>
                            </table>               
                    <p>
                        <strong>Počet přijatých faktur: {purchasesInvoices.length} </strong>
                    </p>
                        <table className="table table-bordered">
                                        <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Číslo faktury</th>
                                            <th>Dodavatel</th>
                                            <th>Odběratel</th>
                                            <th>Cena</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {purchasesInvoices.map((invoice, index) => (
                                            <tr key={index + 1}>
                                                <td>{index + 1}</td>
                                                <td>{invoice.invoiceNumber}</td>
                                                <td>{invoice.seller?.name}</td>
                                                <td>{invoice.buyer?.name}</td>
                                                <td>{invoice.price}</td>
                                                
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table> 
            
            </div>
        </>
    );
};

export default PersonDetail;
