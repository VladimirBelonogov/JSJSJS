const CITIES = ['Москва', 'Казань', 'Санкт-Петербург', 'Екатеринбург'];
const mainUrl = 'https://api.hh.ru/';
// Если CITIES будет new Map, то поиск будет константным временем, а не линейным.

// Задачка 1
async function getData(arr) {
    const url = `${mainUrl}areas`;
    let result = {};

    function dfsAreas(tree, result, arr) {
        for (let node of tree) {
            if (arr.includes(node.name)) {
                result[node.name] = node.id;
            }
    
            if (node.areas && node.areas.length > 0) {
                dfsAreas(node.areas, result, arr);
            }
        }
    
        return result; 
    }

    try {
        const areas = await getJSON(url);
        return dfsAreas(areas, result, arr);
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        return null; 
    }
}

async function getJSON(url, params = {}) {
    let urlWithParams = url;

    if (Object.keys(params).length > 0) {
        let result = '';
        let queryParams = Object.entries(params);
        
        for (let i = 0; i < queryParams.length; i++) {
            result += `${queryParams[i][0]}=${queryParams[i][1]}${i === queryParams.length - 1 ? '' : '&'}`
        }  
        urlWithParams = `${url}?${result}`;
    }

    const response = await fetch(urlWithParams, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'HH-User-Agent': 'Super-application vova.mail97.97@mail.ru',
        },
        redirect: 'follow',
    });

    if (!response.ok) {
        throw new Error(`Ошибка HTTP! Статус: ${response.status}`);
    }

    return response.json();
}


let citiesID = await getData(CITIES);
console.log('Задачка 1',citiesID);

// Задачка 2 - Получение вакансий для фронтенд-разработчиков по каждому городу
// Сейчас заметил, заранее фильтровал с указанной ЗП, чтобы было легче сразу следующую задчку делать

async function getVacanciesByCity(citiesID, keywords) {
    const url = `${mainUrl}vacancies`;
    const perPage = 100;
    let result = {};
    let keywordsResponce;

    for(let i = 0; i < keywords.length; i++) {

        if (i === keywords.length - 1) {
            keywordsResponce += `${keywords[i]}`;
        } else {
            keywordsResponce += `${keywords[i]} OR `;
        }
    }

    const promises = Object.entries(citiesID).map(([cityName, cityID]) => {
        return new Promise(async (resolve, reject) => {
            const vacancies = [];
            let totalPages = 1;
            let page = 0;

            while (page < totalPages ) {
                try {
                    const response = await getJSON(url, {
                        area: cityID,
                        text: keywordsResponce,
                        only_with_salary: true,
                        page,
                        per_page: perPage,
                    });

                    if (!response.items || response.items.length === 0) {
                        break;
                    }

                    vacancies.push(...response.items);
                    totalPages = Math.ceil(response.found / perPage);
                    page++;
                } catch (error) {
                    console.error(`Ошибка при получении вакансий для города ${cityName}:`, error);
                    reject(error);
                }
            }

            result[cityName] = vacancies;
            resolve();
        });
    });

    await Promise.all(promises);

    return result;
}


let vacanciesByCity = await getVacanciesByCity(citiesID, ['Frontend', 'React', 'Vue', 'Angular', 'JavaScript','JS']);
console.log('Задачка 2', vacanciesByCity);

function moneyToExpierence (obj) {
    let result = {};

    for (let [city,vacancies] of Object.entries(obj)) {

        result[city] = {
            allVacancies: JSON.parse(JSON.stringify(vacancies)),
            noExperience: [],
            between1And3: [],
            between3And6: [],
            moreThan6: [],
        };

        let temp = JSON.parse(JSON.stringify(vacancies));

        for(let i = 0; i < temp.length; i++) {
            
            if (temp[i].experience.id === 'noExperience') {
                result[city].noExperience.push(temp[i]);
            } else if (temp[i].experience.id === 'between1And3') {
                result[city].between1And3.push(temp[i]);
            } else if (temp[i].experience.id === 'between3And6') {
                result[city].between3And6.push(temp[i]);
            } else {
                result[city].moreThan6.push(temp[i]);
            }
        }
    }

    return result
}

function getAverageSalary(arr) {
    let total = 0;
    let nalog = 0.13;

    for (let i = 0; i < arr.length; i++) {
        let tempTotal = 0;

        if (arr[i].salary.from && arr[i].salary.to) {
            tempTotal = Math.round((arr[i].salary.from + arr[i].salary.to) / 2);
        } else if (arr[i].salary.from) {
            tempTotal = arr[i].salary.from;
        } else {
            tempTotal = arr[i].salary.to;
        }

        if (arr[i].salary.gross) {
            tempTotal = Math.round(tempTotal / (1 * nalog));
            // Можно сделать учитывая нашу прогрессивную шкалу налога
            // Ну я всё это ****. Ну если нужно, то могу накодить
            // Просто я хз насколько это нужно в таком проекте
            // Ещё если заморочить, то нужно отдельно обработать все значения параметра currency
            // Если что, всё могу, но это будет долго и непонятно нужно ли.
        }

        total += tempTotal;
    }

    return Math.round(total / arr.length);
}

console.log('Задачка 3', moneyToExpierence(vacanciesByCity));

function renderTable(obj) {
    let allVacancies = [];
    let allVacanciesNoExpereince = [];
    let allVacanciesBetween1And3 = [];
    let allVacanciesBetween3And6 = [];
    let allVacanciesMoreThan6 = [];

    for (let city in obj) {
        allVacancies.push(...JSON.parse(JSON.stringify(obj[city].allVacancies)));
        allVacanciesNoExpereince.push(...JSON.parse(JSON.stringify(obj[city].noExperience)));
        allVacanciesBetween1And3.push(...JSON.parse(JSON.stringify(obj[city].between1And3)));
        allVacanciesBetween3And6.push(...JSON.parse(JSON.stringify(obj[city].between3And6)));
        allVacanciesMoreThan6.push(...JSON.parse(JSON.stringify(obj[city].moreThan6)));
    }
    console.log(`\nСредние зарплаты во всех городах: ${Object.keys(obj).join(', ')}`);

    const data = {
        'any': {
            'Средняя зарплата': getAverageSalary(allVacancies.flat()),
            'Количество вакансий': allVacancies.length,
        },
        'noExperience': {
            'Средняя зарплата': getAverageSalary(allVacanciesNoExpereince.flat()),
            'Количество вакансий': allVacanciesNoExpereince.length,
        },
        'between1And3': {
            'Средняя зарплата': getAverageSalary(allVacanciesBetween1And3.flat()),
            'Количество вакансий': allVacanciesBetween1And3.length,
        },
        'between3And6': {
            'Средняя зарплата': getAverageSalary(allVacanciesBetween3And6.flat()),
            'Количество вакансий': allVacanciesBetween3And6.length,
        },
        'moreThan6': {
            'Средняя зарплата': getAverageSalary(allVacanciesMoreThan6.flat()),
            'Количество вакансий': allVacanciesMoreThan6.length,
        }
    };

    console.table(data);
    
    for (let city in obj) {
        console.log(`\nСредние зарплаты в городе ${city}`);
        
        const data = {
            'any': {
                'Средняя зарплата': getAverageSalary(obj[city].allVacancies.flat()),
                'Количество вакансий': obj[city].allVacancies.length,
            },
            'noExperience': {
                'Средняя зарплата': getAverageSalary(obj[city].noExperience.flat()),
                'Количество вакансий': obj[city].noExperience.length,
            },
            'between1And3': {
                'Средняя зарплата': getAverageSalary(obj[city].between1And3.flat()),
                'Количество вакансий': obj[city].between1And3.length,
            },
            'between3And6': {
                'Средняя зарплата': getAverageSalary(obj[city].between3And6.flat()),
                'Количество вакансий': obj[city].between3And6.length,
            },
            'moreThan6': {
                'Средняя зарплата': getAverageSalary(obj[city].moreThan6.flat()),
                'Количество вакансий': obj[city].moreThan6.length,
            }
        };
    
        console.table(data);
    }

    return 'Теперь всё точно готово, и ровно так как нужно, даже немного лучше чем планировалось🤗';
}
console.log('\n\n\nЗадачка 4', renderTable(moneyToExpierence(vacanciesByCity)));
