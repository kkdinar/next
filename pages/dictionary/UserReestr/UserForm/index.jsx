import React from 'react';
import { withRouter } from 'next/router';

const axios = require('axios');
const {
    baseURL
} = require('./../../../../config.js');

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Toast } from 'primereact/toast';
import { InputTextarea } from 'primereact/inputtextarea';
import { Password } from 'primereact/password';

export default withRouter(class Index extends React.Component {
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
        //console.log('this.props.router=', this.props.router);
        let config = {
            params: {
                module: "dictionary",
                form: "UserForm",
                id: this.props.router.query.id,
                UserAuthID: localStorage.getItem("UserAuthID"),
            },
        };
        const answer = await axios.get(baseURL + '/api', config);
        //console.log('answer=',answer.data);
        if (answer.data.Error == "Token is expired") this.props.router.push("/auth");
        if (answer.data.Error)
            this.toast.show({ severity: 'error', summary: 'Ошибка', detail: answer.data.Error, life: 3000 });
        else {
            this.setState({
                DocData: answer.data
            });
        }
    }

    clickExit() {
        this.props.router.push("/dictionary/UserReestr");
    }

    async clickSave() {
        const docData = {
            module: "dictionary",
            form: "UserForm",
            UserAuthID: localStorage.getItem("UserAuthID"),
            data: this.state.DocData,
        };
        //console.log("docData=", docData.data);
        const answer = await axios.post(baseURL + "/api", docData);
        //console.log("answer=", answer);
        if (answer.data.Error)
            this.toast.show({ severity: 'error', summary: 'Ошибка', detail: answer.data.Error, life: 3000 });
        else
            this.toast.show({ severity: 'success', summary: 'Документ сохранён', life: 3000 });
    }
    
    changeDescription(newValue){
        let DocMovement = this.state.DocData.DocMovement;
        const Entity = this.state.DocData.Entity;
        DocMovement.Description = newValue;
        this.setState({
            DocData: {DocMovement, Entity}
        });
    }

    render() {
        const leftContents = (
            <React.Fragment>
                <Button label="Выйти" icon="pi pi-times" onClick={this.clickExit.bind(this)} />
                <Button label="Сохранить" icon="pi pi-save" onClick={this.clickSave.bind(this)} className="p-button-success" />
            </React.Fragment>
        );
        return (
            <div>
                <Toast ref={(el) => this.toast = el} />
                <div>
                    <Toolbar left={leftContents} />
                </div>
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="name">Наименование</label>
                        <InputText id="name" type="text" value={this.state.DocData.DocMovement.Name} onChange={(e) => this.setState({ DocMovement: { Name: e.target.value } })} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="description">Описание</label>
                        <InputTextarea id="description" type="text" value={this.state.DocData.DocMovement.Description} onChange={(e) => this.changeDescription(e.target.value)} rows={5} cols={30} autoResize />
                    </div>
                    <div className="p-field">
                        <label htmlFor="login">Логин</label>
                        <InputText id="login" type="text" value={this.state.DocData.DocMovement.Login} onChange={(e) => this.setState({ DocMovement: { Login: e.target.value } })} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="password">Пароль</label>
                        <Password id="password" type="text" value={this.state.DocData.DocMovement.Password} onChange={(e) => this.setState({ DocMovement: { Password: e.target.value } })} feedback={false} toggleMask />
                    </div>
                </div >
            </div >
        );
    }
})