'use strict'
// First Tab

const storageHandler = {
    displayResults() {
        const table = document.querySelector('table tbody');
        table.innerHTML = '';

        const keys = Object.keys(localStorage).sort((a, b) => {
            const dataA = JSON.parse(localStorage.getItem(a));
            const dataB = JSON.parse(localStorage.getItem(b));
            return dataB.timestamp - dataA.timestamp;
        });

        const maxItems = 10;
        const itemsToDisplay = keys.slice(0, maxItems);

        itemsToDisplay.forEach(key => {
            const data = JSON.parse(localStorage.getItem(key));
            if (data) {
                const row = document.createElement('tr');
                const startDateCell = document.createElement('td');
                const endDateCell = document.createElement('td');
                const resultCell = document.createElement('td');

                startDateCell.textContent = formatDate(data.startDate);
                endDateCell.textContent = formatDate(data.endDate);
                resultCell.textContent = data.result;

                row.appendChild(startDateCell);
                row.appendChild(endDateCell);
                row.appendChild(resultCell);
                table.appendChild(row);
            }
        });
    }
};

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

function ResultTable() {}
ResultTable.prototype = Object.create(storageHandler);

const resultTable = new ResultTable();

function setMinEndDate() {
    const startDateInput = document.querySelector('#startDate');
    const endDateInput = document.querySelector('#endDate');
    const period7Input = document.querySelector('#period7');
    const period30Input = document.querySelector('#period30');
    
    function updateEndDate() {
        const startDate = new Date(startDateInput.value);
        let period = 0;

        if (period7Input.checked) {
            period = 7;
        } else if (period30Input.checked) {
            period = 30;
        }

        if (startDateInput.value) {
            endDateInput.disabled = false;
            
            if (period > 0) {
                const endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + period);
                endDateInput.value = endDate.toISOString().split('T')[0];
            }
        } else {
            endDateInput.disabled = true;
            endDateInput.value = "";
        }
    
    endDateInput.min = startDateInput.value;
    }

    function resetPeriodSelection() {
        period7Input.checked = false;
        period30Input.checked = false;
    }

    startDateInput.addEventListener('change', updateEndDate);
    period7Input.addEventListener('change', updateEndDate);
    period30Input.addEventListener('change', updateEndDate);
    endDateInput.addEventListener('change', resetPeriodSelection);

    endDateInput.disabled = true;
}

function calculate() {
    const startDateInput = document.querySelector('#startDate');
    const endDateInput = document.querySelector('#endDate');
    const daysAllInput = document.querySelector('#daysAll');
    const daysWorkInput = document.querySelector('#daysWork');
    const daysHollidayInput = document.querySelector('#daysHoliday');

    function saveToLocalStorage(data) {
        const key = `#${localStorage.length}`;
        data.timestamp = new Date().getTime();
        localStorage.setItem(key, JSON.stringify(data));
        return key;
    }

    function calculateDays() {
        if (!startDateInput.value) {
            alert('Будь ласка, оберіть початкову дату');
            return;
        } else if (!endDateInput.value) {
            alert('Будь ласка, оберіть кінцеву дату');
            return;
        }

        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);

        if (startDate && endDate) {
            let totalDays = 0;
            let workDays = 0;
            let holidays = 0;
            
            while (startDate <= endDate) {
                totalDays++;
                const dayOfWeek = startDate.getDay();

                if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                    workDays++;
                } else {
                    holidays++;
                }

                startDate.setDate(startDate.getDate() + 1);
            }

            let result = 0;
            if (daysAllInput.checked) {
                result = totalDays;
            } else if (daysWorkInput.checked) {
                result = workDays;
            } else if (daysHollidayInput.checked) {
                result =  holidays;
            }
            
            const data = {
                startDate: startDateInput.value,
                endDate: endDateInput.value,
                result: 'В днях: ' + result,
            };

            const key = saveToLocalStorage(data);
            resultTable.displayResults(); 
        }
    }

    function calculateHours() {  
        if (!startDateInput.value) {
            alert('Будь ласка, оберіть початкову дату');
            return;
        } else if (!endDateInput.value) {
            alert('Будь ласка, оберіть кінцеву дату');
            return;
        }
        
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);

        if (startDate && endDate) {
            let totalHours = 0;

            while (startDate <= endDate) {
                const dayOfWeek = startDate.getDay();
                
                if (daysAllInput.checked || (daysWorkInput.checked && dayOfWeek !== 0 && dayOfWeek !== 6) || (daysHollidayInput.checked && (dayOfWeek === 0 || dayOfWeek === 6))) {
                    totalHours += 24;
                }

                startDate.setDate(startDate.getDate() + 1);
            }

            const data = {
                startDate: startDateInput.value,
                endDate: endDateInput.value,
                result: 'В годинах: ' +  totalHours
            };

            const key = saveToLocalStorage(data);
            resultTable.displayResults();              
        }
    }

    function calculateMinutes() {
        if (!startDateInput.value) {
            alert('Будь ласка, оберіть початкову дату');
            return;
        } else if (!endDateInput.value) {
            alert('Будь ласка, оберіть кінцеву дату');
            return;
        }
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);

        if (startDate && endDate) {
            let totalMinutes = 0;

            while (startDate <= endDate) {
                const dayOfWeek = startDate.getDay();
                
                if (daysAllInput.checked || (daysWorkInput.checked && dayOfWeek !== 0 && dayOfWeek !== 6) || (daysHollidayInput.checked && (dayOfWeek === 0 || dayOfWeek === 6))) {
                    totalMinutes += 24 * 60;
                }

                startDate.setDate(startDate.getDate() + 1);
            }

            const data = {
                startDate: startDateInput.value,
                endDate: endDateInput.value,
                result: 'В хвилинах: ' +  totalMinutes
            };

            const key = saveToLocalStorage(data);
            resultTable.displayResults();               
        }
    }

    function calculateSeconds() {
        if (!startDateInput.value) {
            alert('Будь ласка, оберіть початкову дату');
            return;
        } else if (!endDateInput.value) {
            alert('Будь ласка, оберіть кінцеву дату');
            return;
        }

        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);

        if (startDate && endDate) {
            let totalSeconds = 0;

            while (startDate <= endDate) {
                const dayOfWeek = startDate.getDay();
                
                if (daysAllInput.checked || (daysWorkInput.checked && dayOfWeek !== 0 && dayOfWeek !== 6) || (daysHollidayInput.checked && (dayOfWeek === 0 || dayOfWeek === 6))) {
                    totalSeconds += 24 * 60 * 60;
                }

                startDate.setDate(startDate.getDate() + 1);
            }

            const data = {
                startDate: startDateInput.value,
                endDate: endDateInput.value,
                result: 'В секундах: ' +  totalSeconds
            };


            const key = saveToLocalStorage(data);
            resultTable.displayResults();            
        }
    }

    const calculateDaysBtn = document.querySelector('#calculateDaysBtn');
    calculateDaysBtn.addEventListener('click', calculateDays);

    const calculateHoursBtn = document.querySelector('#calculateHoursBtn');
    calculateHoursBtn.addEventListener('click', calculateHours);

    const calculateMinutesBtn = document.querySelector('#calculateMinutesBtn');
    calculateMinutesBtn.addEventListener('click', calculateMinutes);

    const calculateSecondsBtn = document.querySelector('#calculateSecondsBtn');
    calculateSecondsBtn.addEventListener('click', calculateSeconds);
}

document.addEventListener('DOMContentLoaded', () => {
    setMinEndDate();
    calculate();
    resultTable.displayResults();
});

// Second Tab

const API_KEY = 'NcCbgYoMf6NgLULKHhrfhPlqdA7Sx1gG';
let holidays = [];
let sortAscending = true;

async function getCountries() {
    const url = `https://calendarific.com/api/v2/countries?api_key=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.meta.code === 200) {
            return data.response.countries;
        } else {
            console.error('Error fetching countries:', data.meta);
            return [];
        }
    } catch (error) {
        console.error('Error fetching countries:', error);
        return [];
    }
}

async function loadCountries() {
    try {
        const countries = await getCountries();
        
        const countrySelect = document.querySelector('#country');
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Оберіть країну';
        countrySelect.appendChild(defaultOption);
        
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country['iso-3166'];
            option.textContent = country.country_name;
            countrySelect.appendChild(option);
        });

        countrySelect.addEventListener('change', () => {
            const yearSelect = document.querySelector('#year');
            if (countrySelect.value) {
                yearSelect.disabled = false;
            } else {
                yearSelect.disabled = true;
            }
        });
    } catch (error) {
        console.error('Error loading countries:', error);
    }
}

function loadYears() {
    const yearSelect = document.querySelector('#year');
    const currentYear = new Date().getFullYear();

    for (let year = 2001; year <= 2049; year++) {
        let option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
    yearSelect.value = currentYear;
    yearSelect.disabled = true;
}

async function getHolidays(year, country) {
    const url = `https://calendarific.com/api/v2/holidays?api_key=${API_KEY}&country=${country}&year=${year}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.meta.code === 200) {
            return data.response.holidays;
        } else {
            console.error('Error fetching holidays:', data.meta);
            return [];
        }
    } catch (error) {
        console.error('Error fetching holidays:', error);
        return [];
    }
}

function displayHolidays(holidays) {
    const holidayList = document.querySelector('#holidayList');
    holidayList.innerHTML = '';

    if (Array.isArray(holidays) && holidays.length > 0) {
        holidays.forEach(holiday => {
            const row = document.createElement('tr');
            
            const dateCell = document.createElement('td');
            const date = new Date(holiday.date.iso);
            dateCell.textContent = formatDate(holiday.date.iso);
            row.appendChild(dateCell);
            
            const nameCell = document.createElement('td');
            nameCell.textContent = holiday.name;
            row.appendChild(nameCell);
            
            holidayList.appendChild(row);
        });
    } else {
        alert('Відсутні данні про свята, спробуйте ще');
    }
}
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

document.querySelector('#countHolidaysBtn').addEventListener('click', async () => {
    
    const year = document.querySelector('#year').value;
    const country = document.querySelector('#country').value;

    if (!country) {
        alert('Зробіть свій вибір');
        return;
    }
    
    holidays = await getHolidays(year, country);
    displayHolidays(holidays);
});

document.querySelector('#sortDateBtn').addEventListener('click', () => {
    sortAscending = !sortAscending;
    holidays.sort((a, b) => {
        const dateA = new Date(a.date.iso);
        const dateB = new Date(b.date.iso);
        return sortAscending ? dateA - dateB : dateB - dateA;
    });
    displayHolidays(holidays);
});

document.addEventListener('DOMContentLoaded', async () => {
    await loadCountries();
    loadYears();
});
