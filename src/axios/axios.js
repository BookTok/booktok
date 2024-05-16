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
    getPublisher(id) {
        return this.apiClient.get('/publisher/' + id)
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
    getBookReviewUser(id_user, id_book){
        return this.apiClient.get('/user-review/' + id_user + '/' + id_book)
    }
    searchBook(item){
        return this.apiClient.get('/books-search/', item)
    }
    follow(follow){
        return this.apiClient.post('/follow/', follow)
    }
    unfollowPub(id_user, id_publisher){
        return this.apiClient.delete('/unfollowPublisher/'+ id_user + '/' + id_publisher)
    }
    unfollowAut(id_user, id_author){
        return this.apiClient.delete('/unfollowPublisher/'+ id_user + '/' + id_author)
    }
    unfollowFriend(id_user, id_friend){
        return this.apiClient.delete('/delete-friend/'+ id_user + '/' + id_friend)
    }
    userList(lista){
        return this.apiClient.post('/user-list/', lista)
    }
    updateList(lista, id_user, id_lista){
        return this.apiClient.post('/user-list-update/' + id_user + '/' + id_lista, lista)
    }
    deleteList(id_lista){
        return this.apiClient.delete('/user-list-delete/'+ id_lista )
    }
    bookList(lista){
        return this.apiClient.post('/book-list-post/', lista)
    }
    getFollow(id_user){
        return this.apiClient.get('/followers/'+id_user)
    }
    getFriend(id_user){
        return this.apiClient.get('/friends/'+id_user)
    }
    getREG(id){
        return this.apiClient.get('/user/'+id)
    }
    getAuthorUserId(id) {
        return this.apiClient.get('/author-user/' + id)
    }
    getPublisheUserId(id) {
        return this.apiClient.get('/publisher-user/' + id)
    }
    followFriend(friend){
        return this.apiClient.post('/follow-friend/', friend)
    }
    updatePages(id_book, id_user, book){
        return this.apiClient.put('/book-status-update/' + id_book + '/' + id_user, book)
    }
    createReview(review){
        return this.apiClient.post('/review/', review)
    }
    updateReview(id, review){
        return this.apiClient.put('/review-update/' + id, review)
    }
    areFriends(id_user, id_friend){
        return this.apiClient.get('/are-friend/'+ id_user + '/' + id_friend)
    }
    deleteFriend(id_user, id_friend){
        return this.apiClient.delete('/delete-friend/'+ id_user + '/' + id_friend)
    }
}