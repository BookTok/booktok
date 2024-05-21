<script>
import { useStore } from '@/stores/store'
import { mapState, mapActions } from 'pinia'
import APIService from '../axios/axios.js'
import * as yup from 'yup'
import { setLocale } from 'yup'
import { Form, Field, ErrorMessage } from 'vee-validate'

setLocale({
  mixed: {
    required: 'El campo ${path} no puede estar vacio'
  },
  string: {
    min: 'Debe tener al menos ${min} caracteres',
    max: 'Deebe tener menos de ${max} caracteres',
    email: 'El campo ${path} debe ser un correo electrónico válido'
  }
})
export default {
  data() {
    const validationSchema = yup.object({
      name: yup.string().required().max(250),
      surname: yup.string().required().max(250),
      contraseña: yup
        .string()
        .test('password-check', 'La contraseña no cumple con los requisitos', function (value) {
          if (!value || value === '') return true
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value)
        }),
      repetirContraseña: yup
        .string()
        .test('password-match', 'Las contraseñas no coinciden', function (value, context) {
          const { contraseña } = context.parent
          if (contraseña === '') return true
          return value === contraseña
        })
    })
    return {
      validationSchema,
      register: {
        register: {
        rol: 'REG',
      },
      },
      passwordStudent: ''
    }
  },
  props: ['id'],
  computed: {
    ...mapState(useStore, {
      user: 'user'
    })
  },
  components: {
    Form,
    Field,
    ErrorMessage
  },
  async mounted() {
    const apiService = new APIService(this.user.token)
    try {
      const responseComapny = await apiService.getUserEmail(this.user.email)
        this.register = responseComapny.data
    } catch (error) {
      this.addMsgArray('danger', 'No se ha podido obtener los datos')
    }
    this.passwordStudent = this.register.password
    this.register.password = ''
  },
  methods: {
    ...mapActions(useStore, ['addMsgArray']),
    onFileChange(event) {
      this.register.pic = event.target.files[0]
    },
    async editStudent() {
      const apiService = new APIService(this.user.token)
      this.register.password =
        this.register.password === '' ? this.passwordStudent : this.register.password

      // let formData = new FormData()
      // for (let key in this.register) {
      //   formData.append(key, this.register[key])
      // }

      try {
        await apiService.updateProfile(this.id, this.register)
        this.$router.push('/profile')
      } catch (error) {
        this.addMsgArray('danger', 'Error al redirigir')
      }
    }
  }
}
</script>

<template>
  <p>Si no deseas cambiar la contraseña no introduzcas nada en el campo contraseña</p>
  <Form :initial-values="register" :validation-schema="validationSchema" @submit="editStudent">
    <fieldset>
      <legend>Modificar perfil</legend>

      <div class="form-group">
        <label class="col-md-8 control-label">Nombre</label>
        <div class="col-md-8 inputGroupContainer">
          <div class="input-group">
            <Field
              name="name"
              placeholder="nombre"
              class="form-control"
              type="text"
              v-model="register.name"
            />
            <ErrorMessage name="name" class="error" />
          </div>
        </div>
      </div>

      <div class="form-group">
        <label class="col-md-8 control-label">Apellido</label>
        <div class="col-md-8 inputGroupContainer">
          <div class="input-group">
            <Field
              name="surname"
              placeholder="apellido"
              class="form-control"
              type="text"
              v-model="register.surname"
            />
            <ErrorMessage name="surname" class="error" />
          </div>
        </div>
      </div>

      <div class="form-group">
        <label class="col-md-8 control-label">Contraseña</label>
        <div class="col-md-8 inputGroupContainer">
          <div class="input-group">
            <Field
              name="contraseña"
              placeholder="contraseña"
              class="form-control"
              type="password"
              v-model="register.password"
            />
            <ErrorMessage name="contraseña" class="error" />
          </div>
        </div>
      </div>

      <div class="form-group">
        <label class="col-md-8 control-label">Repetir Contraseña</label>
        <div class="col-md-8 inputGroupContainer">
          <div class="input-group">
            <Field
              name="repetirContraseña"
              placeholder="repetir password"
              class="form-control"
              type="password"
            />
            <ErrorMessage name="repetirContraseña" class="error" />
          </div>
        </div>
      </div>

      <div class="form-group">
        <label class="col-md-8 control-label">Foto Perfil:</label>
        <div class="col-md-8 inputGroupContainer">
          <div class="input-group">
            <input
              name="pic"
              class="form-control"
              type="file"
              @change="onFileChange"
            />
            <ErrorMessage name="pic" class="error" />
          </div>
        </div>
      </div>

      <br />
      <div class="form-group">
        <label class="col-md-8 control-label"></label>
        <div class="col-md-8">
          <button type="submit" class="btn btn-warning">
            Modificar<span class="glyphicon glyphicon-send"></span>
          </button>
        </div>
      </div>
    </fieldset>
  </Form>
</template>

<style>
.container {
  max-width: 500px;
  margin: auto;
  padding: 20px;
  border-radius: 10px;
  background-color: #f8f9fa;
  /* Color de fondo */
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  /* Sombra */
}

.form-group {
  margin-bottom: 20px;
}

label {
  font-weight: bold;
}

.input-group {
  display: flex;
  align-items: center;
}

.input-group input,
.input-group select,
.input-group button {
  margin-right: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
}

.input-group button {
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
}

.input-group button:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  font-size: 0.8rem;
}

.btn-warning {
  background-color: #ffc107;
  color: #212529;
  border-color: #ffc107;
}

.btn-warning:hover {
  background-color: #e0a800;
  border-color: #d39e00;
}

.añadir {
  background-color: #007bff;
  color: white;
}
@media (max-width: 767px) {
  .formbold-input-flex {
    flex-direction: column;
  }

  .formbold-input-flex > div {
    width: 100%;
    margin-bottom: 15px;
  }
}
</style>
