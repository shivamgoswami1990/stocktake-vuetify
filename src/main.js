import Vue from 'vue';
import VueResource from 'vue-resource';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';

Vue.use(VueResource);
Vue.config.productionTip = false;
Vue.http.options.xhr = { withCredentials: true };

// Get the current financial year (From 1 Apr to 31 March)
Vue.prototype.financialYearList = () => {
  const today = new Date();
  const resultList = {
    financial_year: [],
    quarters: []
  };
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear() + '';
  const previousYear = (today.getFullYear() - 1) + '';
  const nextYear = (today.getFullYear() + 1) + '';
  let result;

  if (currentMonth >= 3) {
    // eslint-disable-next-line radix
    result = currentYear + '-' + nextYear.charAt(2) + nextYear.charAt(3);
    console.log(result);
  } else {
    result = previousYear + '-' + currentYear.charAt(2) + currentYear.charAt(3);
  }

  const i = parseInt(result.split('-')[0], 10);
  let j = parseInt(result.split('-')[1], 10);
  for (let k = i; k >= 2016; k--) {
    resultList.financial_year.push(k + '-' + j);
    resultList.quarters.push({
      name: 'Oct-Dec ' + k,
      quarterValue: 4,
      yearValue: k
    });
    resultList.quarters.push({
      name: 'Jul-Sep ' + k,
      quarterValue: 3,
      yearValue: k
    });
    resultList.quarters.push({
      name: 'Apr-Jun ' + k,
      quarterValue: 2,
      yearValue: k
    });
    resultList.quarters.push({
      name: 'Jan-Mar ' + k,
      quarterValue: 1,
      yearValue: k
    });
    j--;
  }
  return resultList;
};

// Set current financial year from generated list
Vue.prototype.currentlySelectedFinancialYear = localStorage['financial-year'];

Vue.prototype.calendarDate = function (date) {
  const dateObj = new Date(date).toDateString().split(' ');
  return dateObj[2] + ' ' + dateObj[1] + ', ' + dateObj[3];
};

Vue.prototype.formattedMonth = function (numericalMonth) {
  return numericalMonth;
};

// Define postage, courier & labour charges list
Vue.prototype.postageOptionsList = function () {
  return {
    0: 'Postage & Courier charges',
    1: 'Labour charges',
    2: 'Postage & Courier & Labour charges',
  };
};

// Get postage options key by looking up value
Vue.prototype.postageOptionsKeyByValue = function (value) {
  const valueList = Object.values(Vue.prototype.postageOptionsList());
  for (let i = 0; i < valueList.length; i++) {
    if (valueList[i] === value) {
      return i;
    }
  }
};

// Check if user as a superuser
Vue.prototype.userDetails = () => {
  if (localStorage.user_info !== undefined && localStorage.user_info !== null) {
    const retrievedData = JSON.parse(localStorage.user_info);
    const initials = retrievedData.first_name.substring(0, 1) + retrievedData.last_name.substring(0, 1);
    retrievedData.intitals = initials;
    return retrievedData;
  }
  return false;
};

// Form validation rules
Vue.prototype.validateFormRules = (value, opType, limit, msg) => {
  if (value !== undefined && value !== null) {
    // Check the operation type e.g. gt, gte, lt, lte or e
    if (opType === 'gt') {
      return value.length > limit || msg;
    } if (opType === 'gte') {
      return value.length >= limit || msg;
    } if (opType === 'lt') {
      return value.length < limit || msg;
    } if (opType === 'lte') {
      return value.length <= limit || msg;
    } if (opType === 'e') {
      return value.length === limit || msg;
    }
  } else {
    return msg;
  }
};

// Set user log in status
Vue.prototype.isLoggedIn = () => !!localStorage.user_info;

// Export formatted data to CSV
Vue.prototype.convertToCSV = (filename, rows) => {
  const processRow = function (row) {
    let finalVal = '';
    for (let j = 0; j < row.length; j++) {
      let innerValue = row[j] === null ? '' : row[j].toString();
      if (row[j] instanceof Date) {
        innerValue = row[j].toLocaleString();
      }
      let result = innerValue.replace(/"/g, '""');
      if (result.search(/("|,|\n)/g) >= 0) { result = '"' + result + '"'; }
      if (j > 0) { finalVal += ','; }
      finalVal += result;
    }
    return finalVal + '\n';
  };

  let csvFile = '';
  for (let i = 0; i < rows.length; i++) {
    csvFile += processRow(rows[i]);
  }

  const blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    const link = document.createElement('a');
    if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');

/* check for logged in user details before any transition */
router.beforeEach((to, from, next) => {
  // Check for token validity when going from login to dashboard
  if (from.name === 'login') {
    if (!Vue.prototype.isLoggedIn()) {
      next({ name: 'login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

Vue.http.interceptors.push((request) => {
  // modify headers
  if (localStorage['access-token'] !== undefined && localStorage['access-token'] !== null) {
    request.headers.set('access-token', localStorage['access-token']);
  }

  if (localStorage.client !== undefined && localStorage.client !== null) {
    request.headers.set('client', localStorage.client);
  }

  if (localStorage.uid !== undefined && localStorage.uid !== null) {
    request.headers.set('uid', localStorage.uid);
  }

  // return response callback
  return function (response) {
    // if unauthorized response or token expired, redirect to login page.
    if (response.status === 401) {
      localStorage.clear();
      localStorage.isUserSessionTimedOut = true;
      this.$router.push({ name: 'login' }); // Navigate to login using router property
    }
  };
});
