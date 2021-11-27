import React from 'react';
import Router from 'next/router';

const axios = require('axios');
const {
    baseURL
} = require('./../config.js');

import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

export default class Auth extends React.Component {
    constructor(props) {
        super(props);
        // Не вызывайте здесь this.setState()!
        this.state = {
            Login: '',
            Password: ''
        };
    }

    async link() {
        const docData = {
            module: "session",
            data: {
                Login: this.state.Login,
                Password: this.state.Password,
            },
        };
        //console.log('docData=',docData.data);
        const answer = await axios.post(baseURL + '/api', docData);
        if (answer.data.Error) this.toast.show({ severity: 'error', summary: 'Ошибка авторизации', detail: answer.data.Error, life: 3000 });
        if (answer.data.Token) {
            localStorage.removeItem("UserAuthID");
            localStorage.setItem("UserAuthID", answer.data.Token);
            this.toast.show({severity:'success', summary: 'Успешная авторизация', detail:'Логин и пароль корректные', life: 3000});
            Router.push("/");
        }
    }



    render() {
        return (
            <div>
                <Toast ref={(el) => this.toast = el} />
                <h1>Авторизация</h1>
                <div className="card">
                    <div className="p-field">
                        <label htmlFor="name" className="p-d-block">Логин</label>
                        <div className="p-d-block">
                            <InputText id="name" type="text" value={this.state.Login} onChange={(e) => this.setState({ Login: e.target.value })} />
                        </div>
                    </div>
                    <div className="p-field">
                        <label htmlFor="description" className="p-d-block">Пароль</label>
                        <div className="p-d-block">
                            <Password id="description" value={this.state.Password} onChange={(e) => this.setState({ Password: e.target.value })} feedback={false} toggleMask />
                        </div>
                    </div>
                    <Button onClick={this.link.bind(this)} label="Войти" />
                </div>
            </div >
        );
    }
}