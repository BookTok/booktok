import axios from 'axios'
const SERVER = import.meta.env.VITE_URL_API

export default class APIService {
    constructor(token) {
        this.apiClient = axios.create({
            baseURL: SERVER,
            withCredentials: false,
            headers: {
                Authorization: 'Bearer ' + token,
            }
        });
        this.setupInterceptors()
    }

    setupInterceptors() {
        this.apiClient.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                if (error.response) {
                    if (error.response.status === 401) {
                        console.log('Token de autorización caducado. Redirigiendo a la página de inicio de sesión...');
                        this.$route.push('/')
                    }
                }
            }
        );
    }

    getBooksByGenre(genero){
        return this.apiClient.get('/books/' + genero)
    }
    getBooksByReviews(){
        return this.apiClient.get('/reviews')
    }
    showBook(id) {
        return this.apiClient.get('/books/' + id)
    }
    getAuthor(id) {
        return this.apiClient.get('/author/' + id)
    }
    getUserEmail(email) {
        return this.apiClient.get('/userEmail/' + email)
    }
    getAuthorEmail(email) {
        return this.apiClient.get('/authorEmail/' + email)
    }
    
    getBookByStatus(id, status){
        return this.apiClient.get('/book-status/' + id + '/' + status)
    }
}