<script>
import { useStore } from '@/stores/store';
import { mapActions } from 'pinia';
import axios from 'axios'
import * as yup from 'yup'
import { setLocale } from 'yup'
import { Form, Field, ErrorMessage } from 'vee-validate'

const SERVER = import.meta.env.VITE_URL_API

export default {
    data() {
        const validationSchema = yup.object({
            email: yup.string().required().email()
                .test('unique-email', 'Este email no está registrado, por favor registrate', async function (value) {
                    if (!value) return true;
                    try {
                        const response = await axios.get(`${SERVER}/checkEmail/${value}`);
                        return response.data;
                    } catch (error) {
                        console.error('Error al verificar el email:', error);
                        return true;
                    }
                }),
            contraseña: yup.string().required()

        });
        return {
            validationSchema,
            user: { email: '', password: '' }
        }
    },
    components: {
        Form,
        ErrorMessage,
        Field
    },
    mounted() {
        localStorage.clear()
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            const user = {
                token,
                name: urlParams.get('name'),
                email: urlParams.get('email'),
                rol: urlParams.get('rol')
            };
            this.user = user
            
            localStorage.setItem('user', JSON.stringify(user))
            window.location.href = '/';
        }
    },
    methods: {
        ...mapActions(useStore, ['addUser', 'addMsgArray']),
        async logIng() {
            try {
                const response = await axios.post(SERVER + '/login', this.user)
                if (response.data.accept === 1) {
                    localStorage.setItem('user', JSON.stringify(response.data))
                    this.addUser(response.data)
                    this.$router.push('/')
                } else {
                    this.$router.push('/')
                    this.addMsgArray('danger', 'Error: no ha activado su cuenta, activela para iniciar sesión.')
                }

            } catch (error) {
                this.addMsgArray('danger', 'Error: datos incorrectos por favor revise que la contarseña sea la correcta')
            }
        },
        async recover() {
            if (this.user.email == '') {
                this.addMsgArray('danger', 'Para poder enviar el email necesitas introducir el email')
            } else {
                try {
                    const response = await axios.get(SERVER + '/sendEmail/' + this.user.email)
                    console.log(response)
                    this.addMsgArray('success', 'Email para recuperar la contraseña enviado con exito, revise su correo')
                } catch (error) {
                    this.addMsgArray('danger', 'Eres un administrador no puedes recuperar contraseña')
                }
            }
        }
    }
}
</script>

<template>
    <Form ref="form" :initial-values="user" :validation-schema="validationSchema" @submit="logIng">
        <h1><span>Iniciar</span> Sesion</h1>
        <Field placeholder="Email" type="text" v-model="user.email" name="email" />
        <ErrorMessage name="email" class="error" />
        <Field placeholder="Password" type="password" v-model="user.password" name="contraseña" />
        <ErrorMessage name="contraseña" class="error" />
        <button class="btn" type="submit">Log in</button>
        <h3>¿No tienes cuenta?</h3>
        <button class="btn" @click="register()"> Registrate </button>
        <h3>¿Te has olvidado de la contraseña?</h3>
        <button class="btn recover" @click="recover()"> ¿Te has olvidado de la contraseña? </button>
    </form>
</template>

<style scoped>
article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
nav,
section {
    display: block;
}

html {
    font-size: 100%;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
}

input:focus,
textarea:focus {
    outline: none;
}

label,
select,
button,
input[type="submit"],
input[type="radio"],
input[type="checkbox"] input[type="button"] {
    cursor: pointer;
}

a,
a:visited,
a:active {
    text-decoration: none;
}

a:hover {
    text-decoration: none;
}

::selection {
    background: #ed327b;
    color: #fff;
}

::-moz-selection {
    background: #ed327b;
    color: #fff;
}

* {
    font-size: 100%;
    margin: 0;
    padding: 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}

* {
    font-family: "Helvetica Neue", Helvetica, Arial;
}

h5 {
    text-align: center;
    margin-top: 5px;
    color: rgba(0, 0, 0, .3);
}

h5>a,
a:visited {
    color: #fff;
    text-decoration: underline;
}

h5>a:hover {
    text-decoration: none;
}

form {
    background: beige;
    border-radius: 6px;
    padding: 20px;
    padding-top: 30px;
    width: 300px;
    margin: 50px auto;
    box-shadow: 15px 15px 0px rgba(0, 0, 0, .1);
}

h1 {
    text-align: center;
    font-size: 1.4em;
    font-weight: 700;
    color: #ccc;
    margin-bottom: 24px;
}

span {
    font-weight: 200;
}

input {
    width: 100%;
    background: #f5f5f5;
    border: 0;
    padding: 20px;
    border-radius: 6px;
    margin-bottom: 10px;
    border: 1px solid #eee;
}

.btn {
    position: relative;
    width: 100%;
    padding: 20px;
    border-radius: 6px;
    border: 0;
    background: #f5f5f5;
    font-size: 1.2em;
    color: rgba(0,0,0,.55);
    text-shadow: 1px 1px 0px rgba(0, 0, 0, .1);
    box-shadow: 0px 3px 0px #dadada;
}

.btn:active {
    top: 3px;
    box-shadow: none;
}

h6 {
    text-align: center;
    padding-top: 20px;
    color: #777;
}

.recover{
    font-size: small
}

h3 {
    margin-top: 10px;
}

</style>