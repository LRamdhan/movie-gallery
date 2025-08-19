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
const popUp: HTMLElement = document.querySelector('.pop-up') as HTMLElement;
const exit: HTMLElement = document.getElementById('exit') as HTMLElement;
const isi: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName('isi') as HTMLCollectionOf<HTMLElement>;


// menampilkan pop up
let clickEvent = () => {
    const detail: HTMLElement[]  = Array.from(document.getElementsByClassName('detail')) as HTMLElement[];
    detail.forEach((btn: HTMLElement) => {
        btn.addEventListener('click', async (event: MouseEvent) => {
            popUp.classList.toggle('pop-up-muncul');
            setTimeout(() => popUp.classList.toggle('opacity-muncul'), 100);
            let rps = await requestFetch(`${MOVIE_URL}/?apikey=${API_KEY}&i=${btn.dataset["imdb"]}`);
            detailMasuk(isi, rps.Title, rps.Year, rps.Director, rps.Genre, rps.Runtime, rps.Plot);
        });
    });
};

// menutup pop up
exit.addEventListener('click', (event: MouseEvent) => {
    popUp.classList.toggle('opacity-muncul');
    setTimeout(() => {
        popUp.classList.toggle('pop-up-muncul')
        detailKeluar(isi);
    }, 520);
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
            loadImg.style.display = 'none';
            galeri.innerHTML = '';
            pesan.innerHTML = 'film tidak ditemukan';
        }            
    } catch(err) {
        console.log('telah terjdi error : ' + err);
    }
});