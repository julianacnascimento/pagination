const data = Array.from({ length: 100 })
    .map((_, index) => `Item ${(index + 1)}`
);

/* ================================================================= */ 

const perPage = 5;
const state = {
    page: 1,
    perPage,
    totalPages: Math.ceil(data.length / perPage), //Math.ceil(): arredonda um número pra cima
    maxVisibleButtons:  5
}

const html = {
    get(element){
        return document.querySelector(element);
    }
}

const constrols = {
    next(){        
        state.page++;

        const lastPage = state.page > state.totalPages;

        if(lastPage){
            state.page--;
        }
    },
    prev(){
        state.page--;

        if(state.page < 1){
            state.page++;
        }
    },
    goTo(page){
        if(page < 1) {
            page = 1;
        }
        state.page = +page

        if(page > state.totalPages) {
            state.page = state.totalPages
        }
    },
    createListeners(){
        html.get('.first').addEventListener('click', () => {
            constrols.goTo(1);
            update();
        })
        html.get('.last').addEventListener('click', () => {
            constrols.goTo(state.totalPages);
            update();
        })
        html.get('.next').addEventListener('click', () => {
            constrols.next();
            update();
        })
        html.get('.prev').addEventListener('click', () => {
            constrols.prev();
            update();
        })
    }
}

const list = {
    create(item) {
        const div = document.createElement('div')
        div.classList.add('item');
        div.innerHTML = item;

        html.get('.list').appendChild(div);
    },
    update() {
        html.get('.list').innerHTML = ""

        let page = state.page - 1;
        let start = page * state.perPage;
        let end = start + state.perPage;

        const paginatedItems = data.slice(start, end);

        paginatedItems.forEach(list.create);
    }
}

const buttons = {
    element: html.get('.pagination .numbers'),
    create(number) {
        const button = document.createElement('div');

        button.innerHTML = number;

        if(state.page == number) {
            button.classList.add('active')
        }

        button.addEventListener('click', (event)=> {
            const page = event.target.innerText;

            constrols.goTo(page);
            update();
        })

        buttons.element.appendChild(button);
    },
    update() {
        buttons.element.innerHTML = "";
        html.get('.pagination .numbers').innerHTML = "";
        const { maxLeft, maxRight } = buttons.calculateMaxVisible();

        for(let page = maxLeft; page <= maxRight; page++){
            buttons.create(page);
        }
    },
    calculateMaxVisible() {
        const { maxVisibleButtons } = state;
        let maxLeft = (state.page - Math.floor(maxVisibleButtons / 2));
        let maxRight = (state.page + Math.floor(maxVisibleButtons / 2));

        if(maxLeft < 1) {
            maxLeft = 1;
            maxRight = maxVisibleButtons;
        }
        if (maxRight > state.totalPages){
            maxLeft = state.totalPages - ( maxVisibleButtons - 1);
            maxRight = state.totalPages;

            if(maxLeft < 1) maxLeft = 1;
        }

        return {maxLeft, maxRight}
    }
}

function update (){
    list.update();
    buttons.update();
}

function init (){
    update();
    constrols.createListeners();
}

init();



