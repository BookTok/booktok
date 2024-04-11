<script>
import { useStore } from '@/stores/store';
import { mapState, mapActions } from 'pinia';
import axios from 'axios';
const SERVER = import.meta.env.VITE_URL_API;
import * as yup from 'yup';
import { setLocale } from 'yup';
import { Form, Field, ErrorMessage, FieldArray } from 'vee-validate';

setLocale({
    mixed: {
        required: 'El campo ${path} no puede estar vacío'
    },
    string: {
        min: 'Debe tener al menos ${min} caracteres',
        max: 'Debe tener menos de ${max} caracteres',
        email: 'El campo ${path} debe ser un correo electrónico válido'
    },
});

export default {
    data() {
        const validationSchema = yup.object({
            repetirContraseña: yup.string().oneOf([yup.ref('contraseña'), null], 'Las contraseñas deben coincidir').required('Debes repetir la contraseña'),
            nombre: yup.string().required().max(250),
            apellidos: yup.string().required().max(250),
            email: yup.string()
                .required()
                .email()
                .test('unique-email', 'Este email ya está registrado', async function (value) {
                    if (!value) return true;
                    try {
                        const response = await axios.get(`${SERVER}/checkEmail/${value}`);
                        return !response.data;
                    } catch (error) {
                        console.error('Error al verificar el email:', error);
                        return true;
                    }
                }),
            contraseña: yup.string().test('password-check', 'La contraseña no cumple con los requisitos', function (value) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
            }),
            aceptar: yup.boolean().required('Debes aceptar los términos y condiciones para continuar.'),
        });

        return {
            validationSchema,
            register: {
                rol: 'REG',
            },
        };
    },
    methods: {
        ...mapActions(useStore, ['addMsgArray']),
        async addUser() {
            
        },

    },
    components: {
        Form,
        Field,
        ErrorMessage,
        FieldArray
    },
};
</script>

<template>
    <div class="formbold-main-wrapper">
        <div class="formbold-form-wrapper">
            <Form :initial-values="register" :validation-schema="validationSchema" @submit="addUser()">
                <div class="formbold-form-title">
                    <h2 class="">Añadir Estudiante</h2>
                </div>

                <div class="formbold-input-flex">
                    <div>
                        <label for="nombre" class="formbold-form-label"> Nombre: </label>
                        <Field name="nombre" type="text" v-model="register.name" class="formbold-form-input" /><br />
                        <ErrorMessage name="nombre" class="validate-error" />
                    </div>

                    <div>
                        <label for="apellidos" class="formbold-form-label"> Apellidos: </label>
                        <Field name="apellidos" type="text" v-model="register.surname" class="formbold-form-input" /><br />
                        <ErrorMessage name="apellidos" class="validate-error" />
                    </div>
                </div>

                <div class="formbold-mb-3">
                    <label for="email" class="formbold-form-label"> E-Mail: </label>
                    <Field name="email" type="text" v-model="register.email" class="formbold-form-input" /><br />
                    <ErrorMessage name="email" class="validate-error" />
                </div>

                <div class="formbold-input-flex">
                    <div>
                        <label for="contraseña" class="formbold-form-label"> Contraseña: </label>
                        <Field name="contraseña" type="password" v-model="register.password" class="formbold-form-input" /><br />
                        <ErrorMessage name="contraseña" class="validate-error" />
                    </div>

                    <div>
                        <label for="repetirContraseña" class="formbold-form-label"> Repetir Contraseña: </label>
                        <Field name="repetirContraseña" type="password" class="formbold-form-input" /><br />
                        <ErrorMessage name="repetirContraseña" class="validate-error" />
                    </div>
                </div>

                <div class="formbold-mb-3">
                    <label for="direccion" class="formbold-form-label"> Dirección: </label>
                    <Field name="direccion" type="text" v-model="register.address" class="formbold-form-input" /><br />
                    <ErrorMessage name="direccion" class="validate-error" />
                </div>

                <div class="formbold-mb-3">
                    <label for="cv" class="formbold-form-label"> Link Curriculum: </label>
                    <Field name="cv" type="text" v-model="register.cv" class="formbold-form-input" /><br />
                    <ErrorMessage name="cv" class="validate-error" />
                </div>

                <div class="formbold-checkbox-wrapper">
                    <label for="supportCheckbox" class="formbold-checkbox-label">
                        <div class="formbold-relative">
                            <Field type="checkbox" class="formbold-input-checkbox" id="supportCheckbox" name="aceptar"
                                :value="false" />
                            <div class="formbold-checkbox-inner">
                                <span class="formbold-opacity-0">
                                    <svg width="11" height="8" viewBox="0 0 11 8" fill="none"
                                        class="formbold-stroke-current">
                                        <path
                                            d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                                            stroke-width="0.4"></path>
                                    </svg>
                                </span>
                            </div>
                        </div>
                        Acepto los términos y condiciones
                    </label>
                    <ErrorMessage name="aceptar" class="validate-error" />
                </div>

                <button type="submit" class="formbold-btn">Añadir</button>
            </Form>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', sans-serif;
}

.formbold-mb-3 {
    margin-bottom: 15px;
}

.formbold-relative {
    position: relative;
}

.formbold-opacity-0 {
    opacity: 0;
}

.formbold-stroke-current {
    stroke: currentColor;
}

#supportCheckbox:checked~div span {
    opacity: 1;
}

.formbold-main-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px;
}

.formbold-form-wrapper {
    margin: 0 auto;
    max-width: 570px;
    width: 100%;
    background: white;
    padding: 40px;
}

.formbold-img {
    margin-bottom: 45px;
}

.formbold-form-title {
    margin-bottom: 30px;
}

.formbold-form-title h2 {
    font-weight: 600;
    font-size: 28px;
    line-height: 34px;
    color: #07074d;
}

.formbold-form-title p {
    font-size: 16px;
    line-height: 24px;
    color: #536387;
    margin-top: 12px;
}

.formbold-input-flex {
    display: flex;
    gap: 20px;
    margin-bottom: 15px;
}

.formbold-input-flex>div {
    width: 50%;
}

.formbold-form-input {
    text-align: center;
    width: 100%;
    padding: 13px 22px;
    border-radius: 5px;
    border: 1px solid #dde3ec;
    background: #ffffff;
    font-weight: 500;
    font-size: 15px;
    color: #536387;
    outline: none;
    resize: none;
}

.formbold-form-input:focus {
    border-color: #6a64f1;
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.05);
}

.formbold-checkbox-wrapper {
    margin-top: 15px;
}

.formbold-form-label {
    color: #536387;
    font-size: 14px;
    line-height: 24px;
    display: block;
    margin-bottom: 10px;
    font-weight: bold;
}

.formbold-checkbox-label {
    display: flex;
    cursor: pointer;
    user-select: none;
    font-size: 16px;
    line-height: 24px;
    color: #536387;
}

.formbold-checkbox-label a {
    margin-left: 5px;
    color: #6a64f1;
}

.formbold-input-checkbox {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
}

.formbold-checkbox-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    margin-right: 16px;
    margin-top: 2px;
    border: 0.7px solid #dde3ec;
    border-radius: 3px;
}

.formbold-btn {
    font-size: 16px;
    border-radius: 5px;
    padding: 14px 25px;
    border: none;
    font-weight: 500;
    background-color: #6a64f1;
    color: white;
    cursor: pointer;
    margin-top: 25px;
}

.formbold-btn:hover {
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.05);
}

.form-group {
    margin-bottom: 15px;
}

.input-group {
    display: flex;
    align-items: center;
    gap: 10px;
}

.input-group select,
.input-group input[type="date"] {
    flex: 1;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #dde3ec;
    font-weight: 500;
    font-size: 16px;
    color: #536387;
    outline: none;
}

.input-group select:focus,
.input-group input[type="date"]:focus {
    border-color: #6a64f1;
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.05);
}

.input-group button {
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    background-color: #6a64f1;
    color: white;
    cursor: pointer;
}

.input-group button:hover {
    background-color: #524bd4;
}

.formbold-btn {
    font-size: 16px;
    border-radius: 5px;
    padding: 14px 25px;
    border: none;
    font-weight: 500;
    background-color: #6a64f1;
    color: white;
    cursor: pointer;
    margin-top: 25px;
}

.formbold-btn:hover {
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.05);
}

.formbold-delete-button {
    font-size: 14px;
    border-radius: 3px;
    padding: 8px 15px;
    border: 1px solid #6a64f1;
    background-color: transparent;
    color: #6a64f1;
    cursor: pointer;
    margin-left: 5px;
}

.formbold-delete-button:hover {
    background-color: #eae7ff;
}
.formbold-add-button {
    font-size: 16px;
    border-radius: 5px;
    padding: 14px 25px;
    border: none;
    background-color: #6a64f1;
    color: white;
    cursor: pointer;
    margin-top: 5px;

}

.formbold-add-button:hover {
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.05);
}
.date-field-container {
    display: flex;
    align-items: center;
}

.validate-error {
    margin-top: 5px;
    color: red;
}
@media (max-width: 767px) {
  .formbold-input-flex {
    flex-direction: column;
  }

  .formbold-input-flex>div {
    width: 100%;
    margin-bottom: 15px;
  }
}
.formbold-delete-button-container {
    margin-top: 15px;
  }
  .formbold-btn-wrapper {
  margin-top: 25px;
  text-align: center;
}

</style>