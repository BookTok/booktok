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

    modStudent(student) {
        return this.apiClient.put('/user/student/update/' + student.id, student)
    }

    getOffers() {
        return this.apiClient.get('/offers')
    }
    getOffersPage(page) {
        return this.apiClient.get('/offers?page=' + page)
    }
    getOfferByCP(cif) {
        return this.apiClient.get('/offerByCP/' + cif)
    }
    modCompany(company) {
        return this.apiClient.put('/user/company/update/' + company.id, company)

    }
    addOffert(offert) {
        return this.apiClient.post('/offers', offert)
    }

    showOffer(id) {
        return this.apiClient.get('/offers/' + id)
    }

    getCompany(cif) {
        return this.apiClient.get('/companyCIF/' + cif)
    }
    singup(idOffer) {
        return this.apiClient.post(`/apply/${idOffer}`);
    }
    getUsersOffer(idOffer) {
        return this.apiClient.get('/userOffert/' + idOffer)
    }
    getStudentEmail(email) {
        return this.apiClient.get('/studentEmail/' + email)
    }
    getCompanyEmail(email) {
        return this.apiClient.get('/companyEmail/' + email)
    }
    deleteCompany(CIF) {
        return this.apiClient.delete('/companyDelete/' + CIF)
    }
    deleteStudent(id) {
        return this.apiClient.delete('/studentDelete/' + id)
    }
    softDelet(id) {
        return this.apiClient.delete('/offersDelete/' + id)
    }
    deshabiliti(id) {
        return this.apiClient.put('/offersDeactivate/' + id)
    }
    getStudentCycle(id) {
        return this.apiClient.get('/studentCicles/' + id)
    }
}