// Import our custom CSS
import './../scss/style.scss'

// Import all of Bootstrap’s JS
import * as bootstrap from 'bootstrap'

import { API_KEY, MOVIE_URL } from './env';
import { elFilm, detailMasuk, detailKeluar, requestFetch } from './functions';

type MovieResult = {
  Type: string, 
  Poster: string,
  Title: string
  Year: string,
  imdbID: string
}

// ambil element html
const galeri: HTMLElement = document.querySelector('.galeri') as HTMLElement;
const keyword: HTMLInputElement = document.querySelector('.keyword') as HTMLInputElement;
const pesan: HTMLElement = document.querySelector('.pesan') as HTMLElement;
const search: HTMLElement = document.querySelector('.search') as HTMLElement;
const loadImg: HTMLElement = document.querySelector('.loading') as HTMLElement;
const exit: HTMLElement = document.getElementById('exit') as HTMLElement;
const isi: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName('isi') as HTMLCollectionOf<HTMLElement>;
const modal: HTMLElement = document.getElementById('mymodal') as HTMLElement;
const myModal = new bootstrap.Modal(modal, {})

// menampilkan pop up
let clickEvent = () => {
    const detail: HTMLElement[]  = Array.from(document.getElementsByClassName('detail')) as HTMLElement[];
    detail.forEach((btn: HTMLElement) => {
        btn.addEventListener('click', async () => {
            myModal.show()
            let rps = await requestFetch(`${MOVIE_URL}/?apikey=${API_KEY}&i=${btn.dataset["imdb"]}`);
            detailMasuk(isi, rps.Title, rps.Year, rps.Director, rps.Genre, rps.Runtime, rps.Plot);
        });
    });
};

// menutup pop up
exit.addEventListener('click', () => {
    myModal.hide()
    const td: HTMLElement[] = Array.from(isi);
    td.forEach((e: HTMLElement) => {
        e.textContent = '';
    });
});

// melakukan pencarian film
search.addEventListener('submit', async (event: SubmitEvent) => {
    event.preventDefault();
    pesan.innerHTML = '';
    galeri.innerHTML = '';
    loadImg.style.display = 'block';
    try { 
        let rps = await requestFetch(`${MOVIE_URL}/?apikey=${API_KEY}&s=${keyword.value}`);
        if(rps.Search) {
            let gambar: string = '';
            rps.Search.forEach((e: MovieResult) => {              
              return gambar += elFilm(e.Poster, e.Title, e.Year, e.imdbID)
            });
            loadImg.style.display = 'none';
            galeri.innerHTML = gambar;
            setTimeout(() => clickEvent(), 200);
        } else {
            let message: string = '';
            switch(rps.Error) {
                case 'Incorrect IMDb ID.' : 
                    message = 'Keyword tidak boleh kosong';
                    break;
                case 'Too many results.' :
                    message = 'Gunakan keyword yang lebih detail';
                    break;
                case 'Movie not found!' :
                    message = 'Film tidak ditemukan';
                    break;
                default : 
                    message = 'Terjadi kesalahan, coba lagi nanti';
            }                 
            loadImg.style.display = 'none';
            galeri.innerHTML = '';
            pesan.style.display = 'block';
            pesan.innerHTML = message;
        }            
    } catch(err) {
        console.log('telah terjdi error : ' + err);
    }
});