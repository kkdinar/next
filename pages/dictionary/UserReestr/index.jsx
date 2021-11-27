import React from 'react';
import Router from 'next/router';

const axios = require('axios');
const {
    baseURL
} = require('./../../../config.js');

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
            },
            selectedRows: []
        };
    }

    componentDidMount = async () => {
        const config = {
            params: {
                module: "dictionary",
                form: "UserReestr",
                UserAuthID: localStorage.getItem("UserAuthID"),
            },
        };
        const answer = await axios.get(baseURL + '/api', config);
        //console.log('answer=',answer.data);
        if (answer.data.Error == "Token is expired") Router.push("/auth");
        if (answer.data.Error) this.toast.show({ severity: 'error', summary: 'Ошибка', detail: answer.data.Error, life: 3000 });
        else {
            this.setState({
                DocData: answer.data
            });
        }
    }

    nameBodyTemplate(rowData) {
        return <Button className="p-button-link" onClick={this.link.bind(this, rowData)} label={rowData.Name} />;
    }

    link(rowData) {
        return Router.push("/dictionary/UserReestr/UserForm?id=" + rowData.id);
    }

    clickExit() {
        Router.push("/dictionary");
    }

    async clickNew() {
        const docData = {
            module: "dictionary",
            form: "UserForm",
            UserAuthID: localStorage.getItem("UserAuthID"),
            data: { DocMovement: { Name: "Новая" } },
        };

        const answer = await axios.post("api", docData);
        if (answer.data.Error) this.toast.show({ severity: 'error', summary: 'Ошибка', detail: answer.data.Error, life: 3000 });
        else {
            return Router.push("/dictionary/UserReestr/UserForm?id=" + answer.data.DocMovement.id);
        }
    }

    async clickDelete() {
        const formData = {
            data: {
                module: "dictionary",
                form: "UserForm",
                data: {
                    DocMovement: this.state.selectedRows,
                },
                UserAuthID: localStorage.getItem("UserAuthID"),
            },
        };
        const answer = await axios.delete("api", formData);
        if (answer.data.Error) this.toast.show({ severity: 'error', summary: 'Ошибка', detail: answer.data.Error, life: 3000 });
        else {
            const newTable = [];
            this.state.DocData.Entity.forEach((row) => {
                if (!this.state.selectedRows.some((r) => row.id == r.id))
                    newTable.push(row);
            });
            this.state.DocData.Entity = newTable;
            this.state.selectedRows = [];
        }
    }
    

    render() {
        const leftContents = (
            <React.Fragment>
                <Button label="Выйти" icon="pi pi-times" onClick={this.clickExit.bind(this)} />
                <Button label="Создать" icon="pi pi-plus" onClick={this.clickNew.bind(this)} className="p-button-success" />
                <Button label="Удалить" icon="pi pi-trash" onClick={this.clickDelete.bind(this)} className="p-button-error" /> 
            </React.Fragment>
        );
        return (
            <div>
                <Toast ref={(el) => this.toast = el} />
                <div>
                    <Toolbar left={leftContents} />
                </div>
                <div className="container">
                    <DataTable value={this.state.DocData.Entity} selectionMode="checkbox" selection={this.state.selectedRows} onSelectionChange={e => this.setState({ selectedRows: e.value })} dataKey="id" responsiveLayout="scroll" showGridlines >
                        <Column selectionMode="multiple" headerStyle={{ width: '3em' }}></Column>
                        <Column field="id" header="Код" headerStyle={{ width: '5em' }}></Column>
                        <Column header="Наименование справочника" body={this.nameBodyTemplate.bind(this)}></Column>
                        <Column field="Description" header="Описание"></Column>
                    </DataTable>
                </div>
            </div>
        );
    }
}