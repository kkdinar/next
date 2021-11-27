import React from 'react';
import Router from 'next/router';

const axios = require('axios');
const {
    baseURL
} = require('./../config.js');

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

export default class Index extends React.Component {
    constructor(props) {
        super(props);
        // Не вызывайте здесь this.setState()!
        this.state = {
            DocData: {
                DocMovement: {},
                Entity: [],
            }
        };
        this.nameBodyTemplate = this.nameBodyTemplate.bind(this);
    }

    componentDidMount = async () => {
        const UserAuthID = localStorage.getItem("UserAuthID");
        const config = {
            params: {
                UserAuthID
            }
        };
        const answer = await axios.get(baseURL + '/api', config);
        //console.log('answer=',answer.data);
        if (answer.data.Error == "Token is expired") Router.push("/auth");
        if (answer.data.Error) console.log('Error=', answer.data.Error);
        else
            this.setState({
                DocData: answer.data
            });
    }

    nameBodyTemplate(rowData) {
        return <Button className="p-button-link" onClick={this.link.bind(this, rowData.module)} label={rowData.Name} />;
    }

    link(module) {
        Router.push("/" + module);
    }

    render() {
        return (
            <div>
                <div className="container">
                    <DataTable value={this.state.DocData.Entity} responsiveLayout="scroll" showGridlines autoLayout>
                        <Column field="id" header="Код"></Column>
                        <Column header="Наименование модуля" body={this.nameBodyTemplate}></Column>
                    </DataTable>
                </div>
            </div>
        );
    }
}