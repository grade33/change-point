// Webp
{
  // Проверка поддержки webp
  function testWebP(callback) {
    let webP = new Image();
    webP.onload = webP.onerror = function () {
      callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  }
  // Добавление класса _webp или _no-webp для HTML 
  testWebP(function (support) {
    let className = support === true ? 'webp' : 'no-webp';
    document.documentElement.classList.add(className);
  });
}

import Choices from "choices.js";


let cryptoArr = [{
    "name": "USDP",
    "minValue": 100,
    "maxValue": 1000000,
    "limits": [{
        "minAmount": "1000",
        "sellPrice": 1.2,
        "buyPrice": 1.3
      },
      {
        "minAmount": "10000",
        "sellPrice": 1.3,
        "buyPrice": 1.4
      }
    ]
  },
  {
    "name": "Tether",
    "minValue": 100,
    "maxValue": 1000000,
    "limits": [{
        "minAmount": "1000",
        "sellPrice": 1.2,
        "buyPrice": 1.3
      },
      {
        "minAmount": "10000",
        "sellPrice": 1.3,
        "buyPrice": 1.4
      }
    ]
  },
  {
    "name": "USDC",
    "minValue": 100,
    "maxValue": 10000,
    "limits": [{
        "minAmount": "1000",
        "sellPrice": 1.2,
        "buyPrice": 1.3
      },
      {
        "minAmount": "10000",
        "sellPrice": 1.3,
        "buyPrice": 1.4
      }
    ]
  }
]

let sellBuy = 'sell';

// Request to the server
// {

//   const resp = await fetch("https://api.airtable.com/v0/app9N1wL2PpG3Vn4F/Table%201?api_key=keyM9WSYH9Taitq6S");
//   const data= await resp.json();


//   cryptoArr = data.records.map(item => {

//     const {minValue, maxValue, name, ...limitsDirtyData} = item.fields;

//     const limitsPreArr = Object.keys(limitsDirtyData).map(item => {
//       return {
//         name: item,
//         limitData: limitsDirtyData[item]
//       }
//     });

//     const limits = [];

//     for(let i=0; i < limitsPreArr.length; i++){
//       const limitPreArrItem = limitsPreArr[i];
//       const limitAmount = limitPreArrItem.name.split("_")[1];
//       const limitType = limitPreArrItem.name.split("_")[2];
//       const limitValue = limitPreArrItem.limitData;

//       const index = limits.findIndex(existingLimitItem => existingLimitItem.minAmount === limitAmount);


//       if(index !== -1){
//         // FOUND
//         limits[index][limitType+"Price"] = 1+ limitValue;

//       } else {
//         // NOT FOUND
//         const newLimit = {
//           minAmount: limitAmount,
//         }
//         newLimit[limitType+"Price"] = 1+ limitValue;

//         limits.push(newLimit);
//       }

//     }



//     return {
//       name,
//       minValue,
//       maxValue,

//       limits
//     }
//   })

// }

// Add items to select
{
  let cryptoSelect = document.querySelector('.block_crypto .select')
  addOption(cryptoSelect, cryptoArr)

  function addOption(select, arr) {
    arr.forEach(obj => {
      let option = select.appendChild(document.createElement('option'))
      option.setAttribute('value', obj.name)
      option.innerHTML = obj.name
    })
  }
}

// Choices.js
{
  document.querySelectorAll('.select').forEach(choicesEl => {
    const choice = new Choices(choicesEl, {
      classNames: {
        containerOuter: 'choices block__select',
      },
      searchEnabled: false,
      position: 'bottom',
      itemSelectText: '',
      shouldSort: false,
      placeholder: true,
    });
    let selectedInfoInput = document.querySelector('.active-select-value')
    selectedInfoInput.value = document.querySelector('.block_crypto .choices__item.choices__item--selectable').dataset.value
    choice.passedElement.element.addEventListener('choice', () => {
      setTimeout(() => {
        selectedInfoInput.value = document.querySelector('.block_crypto .choices__item.choices__item--selectable').dataset.value
        let event = new Event('change')
        selectedInfoInput.dispatchEvent(event)
      }, 10);
    })
  });
}

// Add Select Icon
{
  let i = 1
  document.querySelectorAll('.block_crypto .choices__item[data-id]').forEach((item, idx) => {
    document.styleSheets[0].addRule(`.block_crypto .choices__item[data-id="${i}"]::before`, `content: url('@img/crypto-icon-${i}.svg'); width: 26px; height: 26px; object-fit: contain;`)
    i++
  })

  let selectedCryptoInput = document.querySelector('.active-select-value')
  selectedCryptoInput.addEventListener('change', () => {
    document.styleSheets[0].addRule(`.block_crypto .choices__inner .choices__item[data-id]::before`, `content: url('@img/crypto-icon-${i}.svg'); width: 26px; height: 26px; object-fit: contain;`)
  })
}

// Change fields at input and change text min-value and max-value
{
  let selectedCryptoInput = document.querySelector('.active-select-value')
  let cryptoField = document.querySelector('.block_crypto .block__field')
  let fiatField = document.querySelector('.block_fiat .block__field')
  let cryptoMinValue = document.querySelector('.block_crypto .block__range-text_min')
  let fiatMinValue = document.querySelector('.block_fiat .block__range-text_min')
  let cryptoMaxValue = document.querySelector('.block_crypto .block__range-text_max')
  let fiatMaxValue = document.querySelector('.block_fiat .block__range-text_max')
  let swapBtn = document.querySelector('.swap')

  sellBuyFunc(null, true)

  swapBtn.addEventListener('click', () => {
    setTimeout(() => {
      sellBuyFunc(null, true)
    }, 100);
  })

  cryptoField.addEventListener('input', () => {
    sellBuyFunc(cryptoField)
  })
  fiatField.addEventListener('input', () => {
    sellBuyFunc(fiatField)
  })

  selectedCryptoInput.addEventListener('change', () => {
    sellBuyFunc(null, true)
  })

  function sellBuyFunc(input, bool = false) {
    let activeCrypto = cryptoArr.find(obj => obj.name == selectedCryptoInput.value)
    let idx = 0
    activeCrypto.limits.forEach((obj, index) => {
      if (+cryptoField.value >= +obj.minAmount) {
        idx = index
      }
    });
    if (sellBuy === 'sell') {
      if (bool) {
        cryptoField.value = activeCrypto.minValue
        fiatField.value = +(activeCrypto.minValue * activeCrypto.limits[0].sellPrice).toFixed(1)

        cryptoMinValue.innerHTML = activeCrypto.minValue
        fiatMinValue.innerHTML = +(activeCrypto.minValue * activeCrypto.limits[0].sellPrice).toFixed(1)

        cryptoMaxValue.innerHTML = activeCrypto.maxValue
        fiatMaxValue.innerHTML = +(activeCrypto.maxValue * activeCrypto.limits.at(-1).sellPrice).toFixed(1)
      } else if (input === cryptoField) {
        fiatField.value = +(cryptoField.value * activeCrypto.limits[idx].sellPrice).toFixed(1)
      } else if (input === fiatField) {
        cryptoField.value = +(fiatField.value / activeCrypto.limits[idx].sellPrice).toFixed(1)
      }
    } else if (sellBuy === 'buy') {
      if (bool) {
        cryptoField.value = activeCrypto.minValue
        fiatField.value = +(activeCrypto.minValue * activeCrypto.limits[0].buyPrice).toFixed(1)

        cryptoMinValue.innerHTML = activeCrypto.minValue
        fiatMinValue.innerHTML = +(activeCrypto.minValue * activeCrypto.limits[0].buyPrice).toFixed(1)

        cryptoMaxValue.innerHTML = activeCrypto.maxValue
        fiatMaxValue.innerHTML = +(activeCrypto.maxValue * activeCrypto.limits.at(-1).buyPrice).toFixed(1)
      } else if (input === fiatField) {
        cryptoField.value = +(fiatField.value / activeCrypto.limits[idx].buyPrice).toFixed(1)
      } else if (input === cryptoField) {
        fiatField.value = +(cryptoField.value * activeCrypto.limits[idx].buyPrice).toFixed(1)
      }
    }
  }
}
// Swap Fiat-Crypto
{

  let swapBtn = document.querySelector('.swap')
  let crypto = document.querySelector('.block_crypto')
  let cryptoTitle = crypto.querySelector('.block__title')
  let fiat = document.querySelector('.block_fiat')
  let fiatTitle = fiat.querySelector('.block__title')
  let exchangeBtn = document.querySelector('.block__exchange')
  swapBtn.addEventListener('click', () => {
    let cryptoOrder = getComputedStyle(crypto).order;
    crypto.style.order = getComputedStyle(fiat).order
    fiat.style.order = cryptoOrder

    let cryptoClonTitle = cryptoTitle.innerHTML

    cryptoTitle.innerHTML = fiatTitle.innerHTML
    fiatTitle.innerHTML = cryptoClonTitle

    exchangeBtn.remove()
    if (getComputedStyle(fiat).order == 3) {
      sellBuy = 'sell'
      fiat.appendChild(exchangeBtn)
    } else {
      sellBuy = 'buy'
      crypto.appendChild(exchangeBtn)
    }
  })

}
