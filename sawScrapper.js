const PAGES_TRACKING = ["https://www3.animeflv.net"];
let actualTab = window.location;
const ANIME_FLV_WATCHING_PATH = "ver";
const ANIME_FLV_CHAPTER_PATH = "anime";
const MY_LIST_PATH = "my-list";
const WATCHED_LIST = "watchedList";
const ACTUAL_PAGE = actualTab.origin;

//ANIME FLV//
function addChapterToWatchedList() {
  if (PAGES_TRACKING.includes(ACTUAL_PAGE)) {
    if (isWatchingPath()) {
      try {
        addToWatchedList();
      } catch (err) {
        console.error("Error adding chapter to watched list:", err);
      }
      
    }
    if(isMyListPath()){
      setMylistOfAnimeViewedDomInfo();
    }
  }
}

function setMylistOfAnimeViewedDomInfo(){
  const figure = document.getElementsByTagName("figure");
  figure[0].parentNode.removeChild(figure[0]);

  const Title = document.getElementsByClassName("Title");
  Title[1].textContent ="Your Watched Anime List";

  const SubTitle = document.getElementsByClassName("SubTitle"); 
  SubTitle[0].parentNode.removeChild(SubTitle[0]);

  const parsedData = getLocalData().map(item => JSON.parse(item));

  const bodyContent = document.getElementsByClassName("Page404");
  
  const span = document.createElement('span');
  span.id = "data-table";
  span.appendChild(createAnimeListTable(parsedData));
  bodyContent[0].insertBefore(span, bodyContent[0].children[1])


  const style = document.createElement('style');
style.textContent = `
.table-auto {
    width: 100%;
    text-align: left;
    border-collapse: collapse;
}
.table-auto th, .table-auto td {
    padding: 0.5rem 1rem;
    border-bottom: 1px solid #e2e8f0;
}
.table-auto th {
    background-color: #f7fafc;
}
.table-auto tr:hover {
    background-color: #f1f5f9;
}
.border {
    border: 1px solid #e2e8f0;
}
.border-collapse {
    border-collapse: collapse;
}
.mt-4 {
    margin-top: 1rem;
}
`;
document.head.appendChild(style);


}

function createAnimeListTable(data) {

  const table = document.createElement('table');
  table.classList.add('table-auto', 'w-full', 'text-left', 'border-collapse', 'border', 'border-gray-200', 'mt-4');


  const header = table.createTHead();
  const headerRow = header.insertRow(0);
  headerRow.classList.add('bg-gray-100');

  const headers = ['Id', 'Anime', 'Chapter'];
  headers.forEach((headerText, index) => {
      const cell = headerRow.insertCell(index);
      cell.outerHTML = `<th class="px-4 py-2 border-b border-gray-200">${headerText}</th>`;
  });

  const tbody = table.createTBody();

  data.forEach((item, index) => {
      const row = tbody.insertRow(index);
      row.classList.add('hover:bg-gray-50');
      Object.values(item).forEach((text, cellIndex) => {
          const cell = row.insertCell(cellIndex);
          cell.classList.add('px-4', 'py-2', 'border-b', 'border-gray-200');
          cell.textContent = text;
      });
  });

  return table;
}

function setSpanInChapterDomInfo() {
  let header = document.getElementsByTagName("header");
  let span = document.createElement("span");

  let link = document.createElement("a")
  link.href = `${PAGES_TRACKING[0]}\\my-list`
  link.target ="_blank"
  link.textContent = "My Watched List"
  link.style.backgroundColor= "gray"

  span.textContent = `${getShowName()} ya viste el capitulo ${getChapterNumber()}`;
  span.appendChild(link);
  header[0].appendChild(span);
}

function isWatchingPath() {
  let part = actualTab.pathname.split("/");
  return part[1] === ANIME_FLV_WATCHING_PATH ? true : false;
}

function isMyListPath() {
  let part = actualTab.pathname.split("/");
  return part[1] === MY_LIST_PATH ? true : false;
}

function getPseudoName(){
  let part = actualTab.href.split("/");
  return  part[4].split("-");
}

function getChapterNumber() {
    return isWatchingPath() ? getPseudoName()[getPseudoName().length - 1]: null;
}

function getShowName() {
  if(isWatchingPath){
    let name = getPseudoName();
    name.pop();
   return name.join(" ");
  }
}

function addToWatchedList() {
  if (!isWatched(getActualChapterId())) {
    let watchedList = null;
    watchedList = getLocalData();
    watchedList.push(
      `{"Id":"${getActualChapterId()}", "Show" : "${getShowName()}", "Chapter":"${getChapterNumber()}"}`
    );
    if (watchedList[0] === null) {
      watchedList.shift();
    }
    saveToLocalStorage(watchedList);
  }
}
function saveToLocalStorage(watchedList){
  localStorage.setItem("watchedList", JSON.stringify(watchedList));
}
function isWatched(Id) {
  let data = `[${getLocalData()}]`;
  let watchedList = JSON.parse(data);

  if (watchedList && watchedList.length > 0) {
    let seen = watchedList.filter((watchedList) => watchedList.Id === Id);
    if (seen && seen.length > 0) {
      setSpanInChapterDomInfo();
      return true;
    } else {
      return false;
    }
  }
  return false;
}

function getActualChapterId() {
  return `${getShowName()}@${getChapterNumber()}`;
}

function getLocalData() {
  let data = JSON.parse(localStorage.getItem(WATCHED_LIST));
  return data ? data : [];
}

//ANIME FLV//
addChapterToWatchedList();
