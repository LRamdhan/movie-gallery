// helper ajax
let request = (url: string, keyword: string, callback: (obj: XMLHttpRequest) => void): void => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
      if(xhr.readyState == 4) {
          if(xhr.status == 200) {
              callback(xhr);
          } else {
              console.log('terjadi kesalahan pada saat request');
          }
      }
  };
  xhr.open('POST', `${url}${keyword}`);
  xhr.send();
};

// membuat film
let elFilm = (poster: string, title: string, year: string, imdb: string): string => {    
  return `
    <div class="card">
        <img src="${poster}" class="card-img-top" alt="${title}">
        <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">${year}</p>
            <button type="button" class="btn btn-primary tbl-detail detail" data-imdb="${imdb}">Detail</button>
        </div>
    </div>
`;
};

// memasukan detail ke pop up
let detailMasuk = function(tbl: HTMLCollectionOf<HTMLElement>, ...detail: string[]): void {
  const td: HTMLElement[] = Array.from(tbl);
  let i = 0;
  td.forEach((e: HTMLElement) => {
      e.textContent = detail[i];
      i++;
  });
};

// menghapus detail ke pop up
let detailKeluar = (tbl: HTMLCollectionOf<HTMLElement>): void => {
  const td: HTMLElement[] = Array.from(tbl);
  td.forEach(e => e.textContent = '');
};

// helper fetch
let requestFetch = (url: string): Promise<any> => {
  return fetch(url)
      .then(response => {
          if(response.status != 200) {
              throw new Error(response.statusText);
          } else {
              return response.json();
          }
      });
};

export {request, elFilm, detailMasuk, detailKeluar, requestFetch};