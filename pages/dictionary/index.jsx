import React from 'react';
import Router from 'next/router';

const axios = require('axios');
const {
    baseURL
} = require('./../../config.js');

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Toast } from 'primereact/toast';

export default class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            DocData: {
                DocMovement: {},
                Entity: [],
            }
        };
    }

    componentDidMount = async () => {
        const config = {
            params: {
                module: "dictionary",
                UserAuthID: localStorage.getItem("UserAuthID"),
            },
        };
        const answer = await axios.get(baseURL + '/api', config);
        //console.log('answer=',answer.data);
        if (answer.data.Error == "Token is expired") Router.push("/auth");
        if (answer.data.Error) this.toast.show({ severity: 'error', summary: 'Ошибка', detail: answer.data.Error, life: 3000 });
        else {
            const entity = answer.data.Entity.filter((r) => r.DisplayForm);
            answer.data.Entity = entity;
            this.setState({
                DocData: answer.data
            });
        }
    }

    nameBodyTemplate(rowData) {
        return <Button className="p-button-link" onClick={this.link.bind(this, rowData)} label={rowData.Name} />;
    }

    link(rowData) {
        if (rowData.form == "DictionaryForm") {
            return Router.push("/dictionary/DictionaryForm?id=" + rowData.id);
        } else {
            return Router.push("/dictionary/" + rowData.form);
        }
    }

    clickExit() {
        Router.push("/");
    }

    render() {
        const leftContents = (
            <React.Fragment>
                <Button label="Выйти" icon="pi pi-times" onClick={this.clickExit.bind(this)} />
            </React.Fragment>
        );
        return (
            <div>
                <Toast ref={(el) => this.toast = el} />
                <div>
                    <Toolbar left={leftContents} />
                </div>
                <div className="container">
                    <DataTable value={this.state.DocData.Entity} responsiveLayout="scroll" showGridlines autoLayout>
                        <Column field="id" header="Код"></Column>
                        <Column header="Наименование справочника" body={this.nameBodyTemplate.bind(this)}></Column>
                    </DataTable>
                </div>
            </div>
        );
    }
}